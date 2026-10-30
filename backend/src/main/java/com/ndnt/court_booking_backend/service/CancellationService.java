package com.ndnt.court_booking_backend.service;

import com.ndnt.court_booking_backend.entity.Booking;
import com.ndnt.court_booking_backend.entity.Cancellation;
import com.ndnt.court_booking_backend.common.enums.RefundStatus;

public interface CancellationService {

    Cancellation record(Booking booking, RefundStatus refundStatus);
}

