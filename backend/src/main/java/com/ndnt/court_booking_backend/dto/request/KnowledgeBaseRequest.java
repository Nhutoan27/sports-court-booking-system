package com.ndnt.court_booking_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KnowledgeBaseRequest {

    @NotBlank
    private String category;

    @NotBlank
    private String title;

    @NotBlank
    private String content;
}

