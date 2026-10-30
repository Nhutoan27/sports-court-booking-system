package com.ndnt.court_booking_backend.service.impl;

import com.ndnt.court_booking_backend.common.dto.response.PageResponse;
import com.ndnt.court_booking_backend.common.exception.ForbiddenException;
import com.ndnt.court_booking_backend.common.exception.ResourceNotFoundException;
import com.ndnt.court_booking_backend.entity.Sport;
import com.ndnt.court_booking_backend.repository.SportRepository;
import com.ndnt.court_booking_backend.dto.response.MatchCandidateResponse;
import com.ndnt.court_booking_backend.service.MatchingService;
import com.ndnt.court_booking_backend.dto.response.ChatMessageResponse;
import com.ndnt.court_booking_backend.dto.response.ChatSessionResponse;
import com.ndnt.court_booking_backend.entity.ChatMessage;
import com.ndnt.court_booking_backend.entity.ChatSession;
import com.ndnt.court_booking_backend.mapper.ChatMapper;
import com.ndnt.court_booking_backend.repository.ChatMessageRepository;
import com.ndnt.court_booking_backend.repository.ChatSessionRepository;
import com.ndnt.court_booking_backend.service.ChatbotService;
import com.ndnt.court_booking_backend.service.RetrievalService;
import com.ndnt.court_booking_backend.service.UserService;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChatbotServiceImpl implements ChatbotService {

    private static final String REFUSAL_MESSAGE =
            "Xin lỗi, tôi không tìm thấy thông tin phù hợp trong cơ sở tri thức để trả lời câu hỏi này. "
                    + "Bạn vui lòng liên hệ nhân viên hỗ trợ để được giải đáp thêm.";

    private static final List<String> MATCHING_KEYWORDS = List.of(
            "ghep cap", "ghép cặp", "tim ban choi", "tìm bạn chơi", "tim doi", "tìm đối", "matching");

    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final RetrievalService retrievalService;
    private final MatchingService matchingService;
    private final SportRepository sportRepository;
    private final UserService userService;
    private final ChatClient chatClient;

    public ChatbotServiceImpl(ChatSessionRepository chatSessionRepository, ChatMessageRepository chatMessageRepository,
                               RetrievalService retrievalService, MatchingService matchingService,
                               SportRepository sportRepository, UserService userService, ChatClient chatClient) {
        this.chatSessionRepository = chatSessionRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.retrievalService = retrievalService;
        this.matchingService = matchingService;
        this.sportRepository = sportRepository;
        this.userService = userService;
        this.chatClient = chatClient;
    }

    @Override
    @Transactional
    public ChatSessionResponse createSession(Long userId) {
        ChatSession session = new ChatSession();
        if (userId != null) {
            session.setUser(userService.getEntityById(userId));
        }
        session.setSessionToken(UUID.randomUUID().toString());
        return ChatMapper.toResponse(chatSessionRepository.save(session));
    }

    @Override
    public PageResponse<ChatMessageResponse> listMessages(Long sessionId, Long userId, String sessionToken, Pageable pageable) {
        checkOwnership(sessionId, userId, sessionToken);
        return PageResponse.from(chatMessageRepository.findByChatSessionId(sessionId, pageable).map(m -> ChatMapper.toResponse(m)));
    }

    @Override
    public PageResponse<ChatSessionResponse> listMine(Long userId, Pageable pageable) {
        return PageResponse.from(chatSessionRepository.findByUserId(userId, pageable).map(m -> ChatMapper.toResponse(m)));
    }

    @Override
    @Transactional
    public ChatMessageResponse ask(Long sessionId, Long userId, String sessionToken, String content) {
        ChatSession session = checkOwnership(sessionId, userId, sessionToken);

        saveMessage(session, "USER", content, null);

        String reply;
        String sourceReference;

        if (userId != null && isMatchingIntent(content)) {
            reply = handleMatchingIntent(userId, content);
            sourceReference = "MatchingService (UC-10)";
        } else {
            List<Document> matches = retrievalService.retrieve(content);
            if (matches.isEmpty()) {

                reply = REFUSAL_MESSAGE;
                sourceReference = null;
            } else {
                reply = generateGroundedAnswer(content, matches);
                Set<String> titles = new LinkedHashSet<>();
                for (Document match : matches) {
                    titles.add(String.valueOf(match.getMetadata().get("title")));
                }
                sourceReference = String.join("; ", titles);
            }
        }

        ChatMessage botMessage = saveMessage(session, "BOT", reply, sourceReference);
        return ChatMapper.toResponse(botMessage);
    }

    private ChatSession checkOwnership(Long sessionId, Long userId, String sessionToken) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiên chat"));

        if (session.getUser() != null) {
            if (userId == null || !session.getUser().getId().equals(userId)) {
                throw new ForbiddenException("Không phải phiên chat của bạn");
            }
        } else if (sessionToken == null || !sessionToken.equals(session.getSessionToken())) {
            throw new ForbiddenException("Thiếu hoặc sai session token cho phiên chat ẩn danh này");
        }

        return session;
    }

    private boolean isMatchingIntent(String content) {
        String normalized = content.toLowerCase(Locale.ROOT);
        for (String keyword : MATCHING_KEYWORDS) {
            if (normalized.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    private String handleMatchingIntent(Long userId, String content) {
        String normalized = content.toLowerCase(Locale.ROOT);
        List<Sport> matchedSports = new ArrayList<>();
        for (Sport sport : sportRepository.findAll()) {
            if (normalized.contains(sport.getName().toLowerCase(Locale.ROOT))) {
                matchedSports.add(sport);
            }
        }

        if (matchedSports.size() != 1) {
            return "Bạn muốn tìm người ghép cặp cho môn thể thao nào? Vui lòng nhắn rõ tên môn (vd. \"ghép cặp cầu lông\").";
        }

        Sport sport = matchedSports.get(0);
        try {
            List<MatchCandidateResponse> candidates = matchingService.findCandidatesForUserAndSport(userId, sport.getId());
            if (candidates.isEmpty()) {
                return "Hiện chưa tìm thấy người chơi " + sport.getName() + " nào phù hợp (độ tương đồng ≥ 0.7). Thử lại sau nhé!";
            }
            StringBuilder list = new StringBuilder();
            for (MatchCandidateResponse c : candidates) {
                if (list.length() > 0) {
                    list.append("\n");
                }
                list.append("- ").append(c.getCandidateFullName())
                        .append(" (độ phù hợp ").append(Math.round(c.getSimilarityScore() * 100)).append("%)");
            }
            return "Tìm thấy " + candidates.size() + " người chơi " + sport.getName() + " phù hợp với bạn:\n" + list;
        } catch (RuntimeException e) {
            return e.getMessage();
        }
    }

    private String generateGroundedAnswer(String question, List<Document> matches) {
        StringBuilder context = new StringBuilder();
        for (Document match : matches) {
            if (context.length() > 0) {
                context.append("\n---\n");
            }
            context.append(match.getText());
        }

        String system = "Bạn là trợ lý ảo của hệ thống đặt sân thể thao trực tuyến.\n"
                + "CHỈ được trả lời dựa trên phần NGỮ CẢNH bên dưới, KHÔNG được dùng kiến thức ngoài NGỮ CẢNH.\n"
                + "Nếu NGỮ CẢNH không đủ để trả lời, hãy nói rõ là chưa có đủ thông tin thay vì tự suy đoán.\n"
                + "Nếu câu hỏi liên quan đến so sánh số liệu (giờ, phút, %...), hãy so sánh từng số thật cẩn thận\n"
                + "trước khi kết luận, tránh trả lời mâu thuẫn với chính điều kiện trong NGỮ CẢNH.\n"
                + "Trả lời ngắn gọn, rõ ràng, bằng tiếng Việt, không lặp lại nguyên văn NGỮ CẢNH.\n"
                + "\n"
                + "NGỮ CẢNH:\n"
                + context;

        return chatClient.prompt().system(system).user(question).call().content();
    }

    private ChatMessage saveMessage(ChatSession session, String sender, String content, String sourceReference) {
        ChatMessage message = new ChatMessage();
        message.setChatSession(session);
        message.setSender(sender);
        message.setContent(content);
        message.setSourceReference(sourceReference);

        return chatMessageRepository.saveAndFlush(message);
    }
}

