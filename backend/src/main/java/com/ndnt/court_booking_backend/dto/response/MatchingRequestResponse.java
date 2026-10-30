package com.ndnt.court_booking_backend.dto.response;

import com.ndnt.court_booking_backend.common.enums.MatchingRequestStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MatchingRequestResponse {
    private Long id;
    private Long userId;
    private Long sportId;
    private String sportName;
    private float age;
    private float experience;
    private String skillLevel;
    private String freeTimeVector;
    private MatchingRequestStatus status;
}

