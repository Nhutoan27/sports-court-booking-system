package com.ndnt.court_booking_backend.service;

import com.ndnt.court_booking_backend.dto.request.PlayerProfileRequest;
import com.ndnt.court_booking_backend.dto.response.PlayerProfileResponse;

public interface PlayerProfileService {

    PlayerProfileResponse getMine(Long userId);

    PlayerProfileResponse upsert(Long userId, PlayerProfileRequest request);
}

