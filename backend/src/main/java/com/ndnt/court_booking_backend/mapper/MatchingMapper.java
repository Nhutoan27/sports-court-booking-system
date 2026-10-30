package com.ndnt.court_booking_backend.mapper;

import com.ndnt.court_booking_backend.dto.response.MatchResponse;
import com.ndnt.court_booking_backend.dto.response.MatchingInvitationResponse;
import com.ndnt.court_booking_backend.dto.response.MatchingRequestResponse;
import com.ndnt.court_booking_backend.entity.Match;
import com.ndnt.court_booking_backend.entity.MatchingInvitation;
import com.ndnt.court_booking_backend.entity.MatchingRequest;

public final class MatchingMapper {

    private MatchingMapper() {
    }

    public static MatchingRequestResponse toResponse(MatchingRequest request) {
        return new MatchingRequestResponse(
                request.getId(), request.getUser().getId(), request.getSport().getId(), request.getSport().getName(),
                request.getAge(), request.getExperience(), request.getSkillLevel(), request.getFreeTimeVector(),
                request.getStatus());
    }

    public static MatchingInvitationResponse toResponse(MatchingInvitation invitation) {
        return new MatchingInvitationResponse(
                invitation.getId(), invitation.getMatchingRequest().getId(),
                invitation.getMatchingRequest().getSport().getId(), invitation.getMatchingRequest().getSport().getName(),
                invitation.getSender().getId(), invitation.getSender().getFullName(), invitation.getSender().getAvatarUrl(),
                invitation.getReceiver().getId(), invitation.getReceiver().getFullName(), invitation.getReceiver().getAvatarUrl(),
                invitation.getSimilarityScore(), invitation.getStatus());
    }

    public static MatchResponse toResponse(Match match) {
        return new MatchResponse(
                match.getId(), match.getUser1().getId(), match.getUser1().getFullName(),
                match.getUser2().getId(), match.getUser2().getFullName(),
                match.getSport().getId(), match.getSport().getName(), match.getMatchedAt());
    }
}

