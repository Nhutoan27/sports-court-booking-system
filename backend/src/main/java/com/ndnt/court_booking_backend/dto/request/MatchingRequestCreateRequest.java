package com.ndnt.court_booking_backend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MatchingRequestCreateRequest {

    @NotNull
    private Long sportId;

    @PositiveOrZero
    private float age;

    @PositiveOrZero
    private float experience;

    private String skillLevel;

    private String freeTimeVector;
}

