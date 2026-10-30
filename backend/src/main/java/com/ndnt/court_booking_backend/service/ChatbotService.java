package com.ndnt.court_booking_backend.service;

import com.ndnt.court_booking_backend.common.dto.response.PageResponse;
import com.ndnt.court_booking_backend.service.MatchingService;
import com.ndnt.court_booking_backend.dto.response.ChatMessageResponse;
import com.ndnt.court_booking_backend.dto.response.ChatSessionResponse;
import org.springframework.data.domain.Pageable;

public interface ChatbotService {

    ChatSessionResponse createSession(Long userId);

    PageResponse<ChatMessageResponse> listMessages(Long sessionId, Long userId, String sessionToken, Pageable pageable);

    PageResponse<ChatSessionResponse> listMine(Long userId, Pageable pageable);

    ChatMessageResponse ask(Long sessionId, Long userId, String sessionToken, String content);
}

