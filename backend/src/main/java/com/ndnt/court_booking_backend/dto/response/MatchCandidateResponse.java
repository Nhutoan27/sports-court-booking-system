package com.ndnt.court_booking_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MatchCandidateResponse {
    private Long matchingRequestId;
    private Long candidateUserId;
    private String candidateFullName;
    private String candidateAvatarUrl;
    private double similarityScore;
}

