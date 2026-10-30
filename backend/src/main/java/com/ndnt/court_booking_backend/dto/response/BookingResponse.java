package com.ndnt.court_booking_backend.dto.response;

import com.ndnt.court_booking_backend.common.enums.BookingStatus;
import com.ndnt.court_booking_backend.common.enums.PaymentStatus;
import com.ndnt.court_booking_backend.common.enums.RefundStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private Long userId;

    private String userName;
    private String userEmail;
    private String userPhone;
    private Long courtId;
    private String courtName;
    private LocalDate playDate;
    private List<TimeSlotInfo> timeSlots;
    private BigDecimal totalPrice;
    private BigDecimal depositAmount;
    private BookingStatus status;
    private PaymentStatus paymentStatus;

    private String paymentUrl;
    private LocalDateTime createdAt;

    private RefundStatus refundStatus;

    @Getter
    @AllArgsConstructor
    public static class TimeSlotInfo {
        private Long timeSlotId;
        private LocalTime startTime;
        private LocalTime endTime;
    }
}

