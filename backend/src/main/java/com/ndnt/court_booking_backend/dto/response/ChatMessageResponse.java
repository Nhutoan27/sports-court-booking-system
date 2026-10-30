package com.ndnt.court_booking_backend.dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ChatMessageResponse {
    private Long id;
    private Long sessionId;
    private String sender;
    private String content;
    private String sourceReference;
    private LocalDateTime createdAt;
}

