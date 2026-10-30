package com.ndnt.court_booking_backend.service.impl;

import com.ndnt.court_booking_backend.dto.response.CheckInResponse;
import com.ndnt.court_booking_backend.entity.Booking;
import com.ndnt.court_booking_backend.entity.CheckIn;
import com.ndnt.court_booking_backend.repository.CheckInRepository;
import com.ndnt.court_booking_backend.service.BookingService;
import com.ndnt.court_booking_backend.service.CheckInService;
import com.ndnt.court_booking_backend.common.enums.BookingStatus;
import com.ndnt.court_booking_backend.common.exception.BusinessRuleViolationException;
import com.ndnt.court_booking_backend.entity.User;
import com.ndnt.court_booking_backend.service.UserService;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CheckInServiceImpl implements CheckInService {

    private final CheckInRepository checkInRepository;
    private final BookingService bookingService;
    private final UserService userService;

    public CheckInServiceImpl(CheckInRepository checkInRepository, BookingService bookingService, UserService userService) {
        this.checkInRepository = checkInRepository;
        this.bookingService = bookingService;
        this.userService = userService;
    }

    @Override
    @Transactional
    public CheckInResponse checkIn(Long staffId, Long bookingId) {
        Booking booking = bookingService.getEntityById(bookingId);
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new BusinessRuleViolationException("Chỉ check-in được booking đang ở trạng thái Đã xác nhận");
        }

        User staff = userService.getEntityById(staffId);

        CheckIn checkIn = new CheckIn();
        checkIn.setBooking(booking);
        checkIn.setStaff(staff);
        checkIn.setCheckedInAt(LocalDateTime.now());
        checkIn = checkInRepository.save(checkIn);

        booking.setStatus(BookingStatus.CHECKED_IN);

        return new CheckInResponse(checkIn.getId(), booking.getId(), staff.getId(), checkIn.getCheckedInAt());
    }
}

