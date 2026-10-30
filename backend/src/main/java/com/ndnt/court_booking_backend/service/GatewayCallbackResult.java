package com.ndnt.court_booking_backend.service;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GatewayCallbackResult {
    private Long bookingId;
    private boolean success;
    private String rawResponseCode;
}

