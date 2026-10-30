package com.ndnt.court_booking_backend.service;

import com.ndnt.court_booking_backend.dto.response.CheckInResponse;

public interface CheckInService {

    CheckInResponse checkIn(Long staffId, Long bookingId);
}

