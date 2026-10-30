package com.ndnt.court_booking_backend.dto.response;

import com.ndnt.court_booking_backend.common.enums.MatchingInvitationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MatchingInvitationResponse {
    private Long id;
    private Long matchingRequestId;
    private Long sportId;
    private String sportName;
    private Long senderId;
    private String senderName;
    private String senderAvatarUrl;
    private Long receiverId;
    private String receiverName;
    private String receiverAvatarUrl;
    private float similarityScore;
    private MatchingInvitationStatus status;
}

