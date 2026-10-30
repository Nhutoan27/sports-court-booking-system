package com.ndnt.court_booking_backend.scheduler;

import com.ndnt.court_booking_backend.entity.Booking;
import com.ndnt.court_booking_backend.entity.BookingSlot;
import com.ndnt.court_booking_backend.repository.BookingRepository;
import com.ndnt.court_booking_backend.common.enums.BookingStatus;
import com.ndnt.court_booking_backend.common.enums.PaymentStatus;
import com.ndnt.court_booking_backend.repository.PaymentRepository;
import com.ndnt.court_booking_backend.service.SystemConfigService;
import java.time.LocalDateTime;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class BookingScheduler {

    private static final Logger log = LoggerFactory.getLogger(BookingScheduler.class);

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final SystemConfigService systemConfigService;

    public BookingScheduler(BookingRepository bookingRepository, PaymentRepository paymentRepository,
                             SystemConfigService systemConfigService) {
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.systemConfigService = systemConfigService;
    }

    @Scheduled(fixedRate = 60_000)
    @Transactional
    public void autoCompleteCheckedInBookings() {
        LocalDateTime now = LocalDateTime.now();
        List<Booking> checkedIn = bookingRepository.findByStatus(BookingStatus.CHECKED_IN);

        for (Booking booking : checkedIn) {
            LocalDateTime latestEndTime = null;
            for (BookingSlot bs : booking.getBookingSlots()) {
                LocalDateTime endTime = booking.getPlayDate().atTime(bs.getTimeSlot().getEndTime());
                if (latestEndTime == null || endTime.isAfter(latestEndTime)) {
                    latestEndTime = endTime;
                }
            }

            if (latestEndTime != null && !now.isBefore(latestEndTime)) {
                booking.setStatus(BookingStatus.COMPLETED);
                log.info("BookingScheduler: Booking {} tự động chuyển sang COMPLETED (BR-15)", booking.getId());
            }
        }
    }

    @Scheduled(fixedRate = 60_000)
    @Transactional
    public void autoReleaseExpiredHolds() {
        int holdMinutes;
        try {
            holdMinutes = systemConfigService.getCurrentEffective().getHoldMinutes();
        } catch (Exception e) {

            return;
        }

        LocalDateTime threshold = LocalDateTime.now().minusMinutes(holdMinutes);
        List<Booking> expired = bookingRepository.findByStatusAndCreatedAtBefore(BookingStatus.PENDING, threshold);

        for (Booking booking : expired) {
            paymentRepository.findByBookingId(booking.getId()).ifPresent(payment -> {
                if (payment.getStatus() == PaymentStatus.PENDING) {
                    payment.setStatus(PaymentStatus.FAILED);
                }
            });
            booking.setStatus(BookingStatus.CANCELLED);
            booking.getBookingSlots().clear();
            log.info("BookingScheduler: Booking {} hết hạn giữ chỗ {} phút, tự động giải phóng (BR-02)", booking.getId(), holdMinutes);
        }
    }
}

