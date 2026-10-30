package com.ndnt.court_booking_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PlayerProfileResponse {
    private Long id;
    private Long userId;
    private String favoriteSport;
    private int yearsExperience;
    private String skillLevel;
    private String freeTimeVector;
}

