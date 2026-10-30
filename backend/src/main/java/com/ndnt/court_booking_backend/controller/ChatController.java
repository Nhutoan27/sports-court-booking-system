package com.ndnt.court_booking_backend.controller;

import com.ndnt.court_booking_backend.security.SecurityUtils;
import com.ndnt.court_booking_backend.common.dto.response.ApiResponse;
import com.ndnt.court_booking_backend.common.dto.response.PageResponse;
import com.ndnt.court_booking_backend.dto.request.ChatMessageRequest;
import com.ndnt.court_booking_backend.dto.response.ChatMessageResponse;
import com.ndnt.court_booking_backend.dto.response.ChatSessionResponse;
import com.ndnt.court_booking_backend.service.ChatbotService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Chat", description = "Chatbot RAG Q&A (Guest + Player, UC-15) và chatbot ghép cặp (chỉ Player, UC-14)")
@RestController
@RequestMapping("/chat")
public class ChatController {

    private final ChatbotService chatbotService;

    public ChatController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/sessions")
    public ApiResponse<ChatSessionResponse> createSession() {
        ChatSessionResponse session = chatbotService.createSession(SecurityUtils.currentUserIdOrNull());
        return ApiResponse.ok(session);
    }

    @PreAuthorize("hasRole('PLAYER')")
    @GetMapping("/sessions/me")
    public ApiResponse<PageResponse<ChatSessionResponse>> listMySessions(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ApiResponse.ok(chatbotService.listMine(SecurityUtils.currentUserId(), pageable));
    }

    @GetMapping("/sessions/{id}/messages")
    public ApiResponse<PageResponse<ChatMessageResponse>> listMessages(
            @PathVariable Long id,
            @RequestParam(required = false) String token,
            @PageableDefault(size = 50, sort = "createdAt", direction = Sort.Direction.ASC) Pageable pageable) {
        return ApiResponse.ok(chatbotService.listMessages(id, SecurityUtils.currentUserIdOrNull(), token, pageable));
    }

    @PostMapping("/sessions/{id}/messages")
    public ApiResponse<ChatMessageResponse> sendMessage(
            @PathVariable Long id,
            @RequestParam(required = false) String token,
            @Valid @RequestBody ChatMessageRequest request) {
        ChatMessageResponse reply = chatbotService.ask(id, SecurityUtils.currentUserIdOrNull(), token, request.getContent());
        return ApiResponse.ok(reply);
    }
}

