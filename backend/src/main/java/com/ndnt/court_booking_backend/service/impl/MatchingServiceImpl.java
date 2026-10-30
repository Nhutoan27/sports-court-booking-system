package com.ndnt.court_booking_backend.service.impl;

import com.ndnt.court_booking_backend.common.dto.response.PageResponse;
import com.ndnt.court_booking_backend.common.enums.MatchingInvitationStatus;
import com.ndnt.court_booking_backend.common.enums.MatchingRequestStatus;
import com.ndnt.court_booking_backend.common.exception.BusinessRuleViolationException;
import com.ndnt.court_booking_backend.common.exception.ForbiddenException;
import com.ndnt.court_booking_backend.common.exception.ResourceNotFoundException;
import com.ndnt.court_booking_backend.entity.Sport;
import com.ndnt.court_booking_backend.service.SportService;
import com.ndnt.court_booking_backend.dto.request.MatchingRequestCreateRequest;
import com.ndnt.court_booking_backend.dto.request.SendInvitationRequest;
import com.ndnt.court_booking_backend.dto.response.MatchCandidateResponse;
import com.ndnt.court_booking_backend.dto.response.MatchResponse;
import com.ndnt.court_booking_backend.dto.response.MatchingInvitationResponse;
import com.ndnt.court_booking_backend.dto.response.MatchingRequestResponse;
import com.ndnt.court_booking_backend.entity.Match;
import com.ndnt.court_booking_backend.entity.MatchingInvitation;
import com.ndnt.court_booking_backend.entity.MatchingRequest;
import com.ndnt.court_booking_backend.mapper.MatchingMapper;
import com.ndnt.court_booking_backend.repository.MatchRepository;
import com.ndnt.court_booking_backend.repository.MatchingInvitationRepository;
import com.ndnt.court_booking_backend.repository.MatchingRequestRepository;
import com.ndnt.court_booking_backend.service.CosineSimilarityCalculator;
import com.ndnt.court_booking_backend.service.MatchingService;
import com.ndnt.court_booking_backend.entity.User;
import com.ndnt.court_booking_backend.service.UserService;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MatchingServiceImpl implements MatchingService {

    private static final double SIMILARITY_THRESHOLD = 0.7;
    private static final int TOP_K = 5;

    private final MatchingRequestRepository matchingRequestRepository;
    private final MatchingInvitationRepository matchingInvitationRepository;
    private final MatchRepository matchRepository;
    private final CosineSimilarityCalculator similarityCalculator;
    private final UserService userService;
    private final SportService sportService;

    public MatchingServiceImpl(MatchingRequestRepository matchingRequestRepository,
                                MatchingInvitationRepository matchingInvitationRepository,
                                MatchRepository matchRepository,
                                CosineSimilarityCalculator similarityCalculator,
                                UserService userService, SportService sportService) {
        this.matchingRequestRepository = matchingRequestRepository;
        this.matchingInvitationRepository = matchingInvitationRepository;
        this.matchRepository = matchRepository;
        this.similarityCalculator = similarityCalculator;
        this.userService = userService;
        this.sportService = sportService;
    }

    @Override
    @Transactional
    public MatchingRequestResponse createRequest(Long userId, MatchingRequestCreateRequest dto) {
        matchingRequestRepository.findByUserIdAndSportIdAndStatus(userId, dto.getSportId(), MatchingRequestStatus.DANG_TIM)
                .ifPresent(existing -> {
                    throw new BusinessRuleViolationException("Bạn đang có 1 yêu cầu tìm ghép cặp cho môn này rồi");
                });

        User user = userService.getEntityById(userId);
        Sport sport = sportService.getEntityById(dto.getSportId());

        MatchingRequest request = new MatchingRequest();
        request.setUser(user);
        request.setSport(sport);
        request.setAge(dto.getAge());
        request.setExperience(dto.getExperience());
        request.setSkillLevel(dto.getSkillLevel());
        request.setFreeTimeVector(dto.getFreeTimeVector());
        request.setStatus(MatchingRequestStatus.DANG_TIM);

        return MatchingMapper.toResponse(matchingRequestRepository.save(request));
    }

    @Override
    public PageResponse<MatchingRequestResponse> listMine(Long userId, Pageable pageable) {
        return PageResponse.from(matchingRequestRepository.findByUserId(userId, pageable).map(m -> MatchingMapper.toResponse(m)));
    }

    @Override
    @Transactional
    public void cancelRequest(Long userId, Long requestId) {
        MatchingRequest request = getEntityById(requestId);
        if (!request.getUser().getId().equals(userId)) {
            throw new ForbiddenException("Không phải yêu cầu ghép cặp của bạn");
        }
        if (request.getStatus() != MatchingRequestStatus.DANG_TIM) {
            throw new BusinessRuleViolationException("Chỉ huỷ được yêu cầu đang ở trạng thái Đang tìm");
        }

        request.setStatus(MatchingRequestStatus.HET_HAN);
    }

    @Override
    public List<MatchCandidateResponse> findCandidates(Long userId, Long requestId) {
        MatchingRequest request = getEntityById(requestId);
        if (!request.getUser().getId().equals(userId)) {
            throw new ForbiddenException("Không phải yêu cầu ghép cặp của bạn");
        }

        List<MatchingRequest> pool = matchingRequestRepository.findBySportIdAndStatusAndUserIdNot(
                request.getSport().getId(), MatchingRequestStatus.DANG_TIM, userId);

        List<MatchCandidateResponse> candidates = new ArrayList<>();
        for (MatchingRequest candidate : pool) {
            double score = similarityCalculator.similarity(request, candidate);
            if (score >= SIMILARITY_THRESHOLD) {
                candidates.add(new MatchCandidateResponse(
                        candidate.getId(), candidate.getUser().getId(), candidate.getUser().getFullName(),
                        candidate.getUser().getAvatarUrl(), score));
            }
        }

        candidates.sort((c1, c2) -> Double.compare(c2.getSimilarityScore(), c1.getSimilarityScore()));
        if (candidates.size() > TOP_K) {
            candidates = candidates.subList(0, TOP_K);
        }
        return candidates;
    }

    @Override
    @Transactional
    public MatchingInvitationResponse sendInvitation(Long senderId, SendInvitationRequest dto) {
        if (senderId.equals(dto.getReceiverUserId())) {
            throw new BusinessRuleViolationException("Không thể tự mời chính mình");
        }

        MatchingRequest senderRequest = matchingRequestRepository
                .findByUserIdAndSportIdAndStatus(senderId, dto.getSportId(), MatchingRequestStatus.DANG_TIM)
                .orElseThrow(() -> new BusinessRuleViolationException("Bạn chưa có yêu cầu tìm ghép cặp Đang tìm cho môn này"));

        MatchingRequest receiverRequest = matchingRequestRepository
                .findByUserIdAndSportIdAndStatus(dto.getReceiverUserId(), dto.getSportId(), MatchingRequestStatus.DANG_TIM)
                .orElseThrow(() -> new BusinessRuleViolationException("Người này hiện không tìm ghép cặp cho môn này"));

        if (matchingInvitationRepository.existsBySenderIdAndReceiverIdAndMatchingRequestIdAndStatus(
                senderId, dto.getReceiverUserId(), senderRequest.getId(), MatchingInvitationStatus.PENDING)) {
            throw new BusinessRuleViolationException("Đã gửi lời mời cho người này rồi, đang chờ phản hồi");
        }

        if (matchingInvitationRepository.existsBySenderIdAndReceiverIdAndMatchingRequest_Sport_IdAndStatus(
                dto.getReceiverUserId(), senderId, dto.getSportId(), MatchingInvitationStatus.PENDING)) {
            throw new BusinessRuleViolationException(
                    "Người này đã gửi lời mời ghép cặp cho bạn — vui lòng vào mục lời mời đã nhận để chấp nhận hoặc từ chối");
        }

        double score = similarityCalculator.similarity(senderRequest, receiverRequest);

        MatchingInvitation invitation = new MatchingInvitation();
        invitation.setMatchingRequest(senderRequest);
        invitation.setSender(senderRequest.getUser());
        invitation.setReceiver(receiverRequest.getUser());
        invitation.setSimilarityScore((float) score);
        invitation.setStatus(MatchingInvitationStatus.PENDING);

        return MatchingMapper.toResponse(matchingInvitationRepository.save(invitation));
    }

    @Override
    public PageResponse<MatchingInvitationResponse> listReceivedInvitations(Long userId, Pageable pageable) {
        return PageResponse.from(matchingInvitationRepository.findByReceiverId(userId, pageable).map(m -> MatchingMapper.toResponse(m)));
    }

    @Override
    public PageResponse<MatchingInvitationResponse> listSentInvitations(Long userId, Pageable pageable) {
        return PageResponse.from(matchingInvitationRepository.findBySenderId(userId, pageable).map(m -> MatchingMapper.toResponse(m)));
    }

    @Override
    @Transactional
    public MatchingInvitationResponse respondInvitation(Long receiverId, Long invitationId, boolean accept) {
        MatchingInvitation invitation = matchingInvitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lời mời"));

        if (!invitation.getReceiver().getId().equals(receiverId)) {
            throw new ForbiddenException("Không phải lời mời gửi cho bạn");
        }
        if (invitation.getStatus() != MatchingInvitationStatus.PENDING) {
            throw new BusinessRuleViolationException("Lời mời đã được xử lý trước đó");
        }

        if (accept) {
            invitation.setStatus(MatchingInvitationStatus.ACCEPTED);

            Sport sport = invitation.getMatchingRequest().getSport();
            Match match = new Match();
            match.setUser1(invitation.getSender());
            match.setUser2(invitation.getReceiver());
            match.setSport(sport);
            match.setMatchedAt(LocalDateTime.now());
            matchRepository.save(match);

            markMatched(invitation.getSender().getId(), sport.getId());
            markMatched(invitation.getReceiver().getId(), sport.getId());
        } else {
            invitation.setStatus(MatchingInvitationStatus.REJECTED);
        }

        return MatchingMapper.toResponse(invitation);
    }

    @Override
    @Transactional
    public MatchingInvitationResponse cancelInvitation(Long senderId, Long invitationId) {
        MatchingInvitation invitation = matchingInvitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lời mời"));

        if (!invitation.getSender().getId().equals(senderId)) {
            throw new ForbiddenException("Không phải lời mời do bạn gửi");
        }
        if (invitation.getStatus() != MatchingInvitationStatus.PENDING) {
            throw new BusinessRuleViolationException("Chỉ huỷ được lời mời đang chờ phản hồi");
        }

        invitation.setStatus(MatchingInvitationStatus.CANCELLED);
        return MatchingMapper.toResponse(invitation);
    }

    @Override
    public PageResponse<MatchResponse> listMyMatches(Long userId, Pageable pageable) {
        return PageResponse.from(matchRepository.findByUser1IdOrUser2Id(userId, userId, pageable).map(m -> MatchingMapper.toResponse(m)));
    }

    @Override
    public List<MatchCandidateResponse> findCandidatesForUserAndSport(Long userId, Long sportId) {
        MatchingRequest request = matchingRequestRepository
                .findByUserIdAndSportIdAndStatus(userId, sportId, MatchingRequestStatus.DANG_TIM)
                .orElseThrow(() -> new BusinessRuleViolationException(
                        "Bạn chưa có yêu cầu tìm ghép cặp Đang tìm cho môn này — hãy tạo yêu cầu trước (POST /matching/requests)"));
        return findCandidates(userId, request.getId());
    }

    @Override
    public MatchingRequest getEntityById(Long id) {
        return matchingRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy yêu cầu ghép cặp"));
    }

    private void markMatched(Long userId, Long sportId) {
        matchingRequestRepository.findByUserIdAndSportIdAndStatus(userId, sportId, MatchingRequestStatus.DANG_TIM)
                .ifPresent(req -> req.setStatus(MatchingRequestStatus.DA_GHEP));
    }
}

