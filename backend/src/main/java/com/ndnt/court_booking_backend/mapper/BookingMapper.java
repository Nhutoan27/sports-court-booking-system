package com.ndnt.court_booking_backend.mapper;

import com.ndnt.court_booking_backend.dto.response.BookingResponse;
import com.ndnt.court_booking_backend.entity.Booking;
import com.ndnt.court_booking_backend.entity.BookingSlot;
import com.ndnt.court_booking_backend.common.enums.PaymentStatus;
import com.ndnt.court_booking_backend.common.enums.RefundStatus;
import java.util.ArrayList;
import java.util.List;

public final class BookingMapper {

    private BookingMapper() {
    }

    public static BookingResponse toResponse(Booking booking, PaymentStatus paymentStatus, String paymentUrl,
                                              RefundStatus refundStatus) {
        List<BookingResponse.TimeSlotInfo> timeSlots = new ArrayList<>();
        for (BookingSlot slot : booking.getBookingSlots()) {
            timeSlots.add(toTimeSlotInfo(slot));
        }

        return new BookingResponse(
                booking.getId(), booking.getUser().getId(), booking.getUser().getFullName(),
                booking.getUser().getEmail(), booking.getUser().getPhone(),
                booking.getCourt().getId(), booking.getCourt().getName(),
                booking.getPlayDate(), timeSlots, booking.getTotalPrice(), booking.getDepositAmount(),
                booking.getStatus(), paymentStatus, paymentUrl, booking.getCreatedAt(), refundStatus);
    }

    private static BookingResponse.TimeSlotInfo toTimeSlotInfo(BookingSlot slot) {
        return new BookingResponse.TimeSlotInfo(
                slot.getTimeSlot().getId(), slot.getTimeSlot().getStartTime(), slot.getTimeSlot().getEndTime());
    }
}

