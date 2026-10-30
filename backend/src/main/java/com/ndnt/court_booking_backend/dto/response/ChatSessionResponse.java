package com.ndnt.court_booking_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ChatSessionResponse {
    private Long id;

    private Long userId;
    private String sessionToken;
}

