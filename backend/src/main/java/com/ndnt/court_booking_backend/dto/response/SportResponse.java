package com.ndnt.court_booking_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SportResponse {
    private Long id;
    private String name;
    private String status;
}

