package com.ndnt.court_booking_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CourtResponse {
    private Long id;
    private Long sportId;
    private String sportName;
    private String name;
    private String status;
}

