package com.ndnt.court_booking_backend.mapper;

import com.ndnt.court_booking_backend.dto.response.ChatMessageResponse;
import com.ndnt.court_booking_backend.dto.response.ChatSessionResponse;
import com.ndnt.court_booking_backend.entity.ChatMessage;
import com.ndnt.court_booking_backend.entity.ChatSession;

public final class ChatMapper {

    private ChatMapper() {
    }

    public static ChatSessionResponse toResponse(ChatSession session) {
        return new ChatSessionResponse(
                session.getId(), session.getUser() != null ? session.getUser().getId() : null, session.getSessionToken());
    }

    public static ChatMessageResponse toResponse(ChatMessage message) {
        return new ChatMessageResponse(
                message.getId(), message.getChatSession().getId(), message.getSender(),
                message.getContent(), message.getSourceReference(), message.getCreatedAt());
    }
}

