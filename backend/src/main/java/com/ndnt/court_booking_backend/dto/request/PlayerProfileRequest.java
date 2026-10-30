package com.ndnt.court_booking_backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayerProfileRequest {
    private String favoriteSport;
    private int yearsExperience;
    private String skillLevel;
    private String freeTimeVector;
}

