package com.ndnt.court_booking_backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SendInvitationRequest {

    @NotNull
    private Long sportId;

    @NotNull
    private Long receiverUserId;
}

