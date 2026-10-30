package com.ndnt.court_booking_backend.service;

import com.ndnt.court_booking_backend.dto.response.NoShowResponse;

public interface NoShowService {

    NoShowResponse markNoShow(Long staffId, Long bookingId);
}

