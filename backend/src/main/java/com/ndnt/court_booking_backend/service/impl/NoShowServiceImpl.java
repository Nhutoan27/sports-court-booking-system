package com.ndnt.court_booking_backend.service.impl;

import com.ndnt.court_booking_backend.dto.response.NoShowResponse;
import com.ndnt.court_booking_backend.entity.Booking;
import com.ndnt.court_booking_backend.entity.BookingSlot;
import com.ndnt.court_booking_backend.entity.NoShow;
import com.ndnt.court_booking_backend.repository.NoShowRepository;
import com.ndnt.court_booking_backend.service.BookingService;
import com.ndnt.court_booking_backend.service.NoShowService;
import com.ndnt.court_booking_backend.common.enums.BookingStatus;
import com.ndnt.court_booking_backend.common.exception.BusinessRuleViolationException;
import com.ndnt.court_booking_backend.service.SystemConfigService;
import com.ndnt.court_booking_backend.entity.User;
import com.ndnt.court_booking_backend.service.UserService;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NoShowServiceImpl implements NoShowService {

    private final NoShowRepository noShowRepository;
    private final BookingService bookingService;
    private final UserService userService;
    private final SystemConfigService systemConfigService;

    public NoShowServiceImpl(NoShowRepository noShowRepository, BookingService bookingService,
                              UserService userService, SystemConfigService systemConfigService) {
        this.noShowRepository = noShowRepository;
        this.bookingService = bookingService;
        this.userService = userService;
        this.systemConfigService = systemConfigService;
    }

    @Override
    @Transactional
    public NoShowResponse markNoShow(Long staffId, Long bookingId) {
        Booking booking = bookingService.getEntityById(bookingId);
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new BusinessRuleViolationException("Chỉ đánh dấu no-show cho booking đang ở trạng thái Đã xác nhận");
        }

        LocalDateTime earliestPlayTime = null;
        for (BookingSlot bs : booking.getBookingSlots()) {
            LocalDateTime startTime = booking.getPlayDate().atTime(bs.getTimeSlot().getStartTime());
            if (earliestPlayTime == null || startTime.isBefore(earliestPlayTime)) {
                earliestPlayTime = startTime;
            }
        }
        if (earliestPlayTime == null) {
            throw new BusinessRuleViolationException("Booking không có khung giờ nào");
        }

        int noShowMinutes = systemConfigService.getCurrentEffective().getNoShowMinutes();
        LocalDateTime eligibleFrom = earliestPlayTime.plusMinutes(noShowMinutes);
        if (LocalDateTime.now().isBefore(eligibleFrom)) {
            throw new BusinessRuleViolationException(
                    "Chưa đủ " + noShowMinutes + " phút kể từ giờ chơi, chưa thể đánh dấu no-show (BR-06)");
        }

        User staff = userService.getEntityById(staffId);

        NoShow noShow = new NoShow();
        noShow.setBooking(booking);
        noShow.setStaff(staff);
        noShow.setMarkedAt(LocalDateTime.now());
        noShow = noShowRepository.save(noShow);

        booking.setStatus(BookingStatus.NO_SHOW);

        return new NoShowResponse(noShow.getId(), booking.getId(), staff.getId(), noShow.getMarkedAt());
    }
}

