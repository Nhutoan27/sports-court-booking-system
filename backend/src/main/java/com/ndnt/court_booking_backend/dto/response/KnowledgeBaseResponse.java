package com.ndnt.court_booking_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class KnowledgeBaseResponse {
    private Long id;
    private Long adminId;
    private String category;
    private String title;
    private String content;
}

