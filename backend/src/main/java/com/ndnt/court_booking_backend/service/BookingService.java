package com.ndnt.court_booking_backend.service;

import com.ndnt.court_booking_backend.dto.request.CreateBookingRequest;
import com.ndnt.court_booking_backend.dto.response.BookingResponse;
import com.ndnt.court_booking_backend.entity.Booking;
import com.ndnt.court_booking_backend.common.dto.response.PageResponse;
import com.ndnt.court_booking_backend.common.enums.BookingStatus;
import com.ndnt.court_booking_backend.service.PaymentGatewayClient;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Pageable;

public interface BookingService {

    Booking getEntityById(Long id);

    BookingResponse getByIdForUser(Long id, Long requesterId, boolean privileged, String clientIp);

    PageResponse<BookingResponse> listMine(Long userId, Pageable pageable);

    PageResponse<BookingResponse> listAll(BookingStatus status, LocalDate playDate, Pageable pageable);

    List<Long> listBookedTimeSlotIds(Long courtId, LocalDate playDate);

    BookingResponse create(Long userId, CreateBookingRequest request, String clientIp);

    BookingResponse cancel(Long userId, Long bookingId);

    boolean handlePaymentCallback(Map<String, String> params);
}

