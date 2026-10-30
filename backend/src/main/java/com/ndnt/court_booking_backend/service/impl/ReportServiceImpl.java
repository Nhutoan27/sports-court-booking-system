package com.ndnt.court_booking_backend.service.impl;

import com.ndnt.court_booking_backend.common.enums.BookingStatus;
import com.ndnt.court_booking_backend.common.exception.BusinessRuleViolationException;
import com.ndnt.court_booking_backend.dto.response.ReportSummaryResponse;
import com.ndnt.court_booking_backend.entity.Booking;
import com.ndnt.court_booking_backend.repository.BookingRepository;
import com.ndnt.court_booking_backend.repository.PaymentRepository;
import com.ndnt.court_booking_backend.service.ReportService;
import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ReportServiceImpl implements ReportService {

    private static final int DEFAULT_RANGE_DAYS = 30;

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    public ReportServiceImpl(BookingRepository bookingRepository, PaymentRepository paymentRepository) {
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
    }

    @Override
    public ReportSummaryResponse getSummary(LocalDate from, LocalDate to) {
        LocalDate rangeTo = to != null ? to : LocalDate.now();
        LocalDate rangeFrom = from != null ? from : rangeTo.minusDays(DEFAULT_RANGE_DAYS - 1);
        if (rangeFrom.isAfter(rangeTo)) {
            throw new BusinessRuleViolationException("Khoảng thời gian không hợp lệ: 'from' phải trước 'to'");
        }

        LocalDateTime fromDateTime = rangeFrom.atStartOfDay();
        LocalDateTime toDateTime = rangeTo.plusDays(1).atStartOfDay();

        BigDecimal totalRevenue = paymentRepository.sumSuccessAmountBetween(fromDateTime, toDateTime);

        List<ReportSummaryResponse.RevenueByDay> revenueByDay = new ArrayList<>();
        for (Object[] row : paymentRepository.sumSuccessAmountGroupByDay(fromDateTime, toDateTime)) {
            revenueByDay.add(new ReportSummaryResponse.RevenueByDay(toLocalDate(row[0]), (BigDecimal) row[1]));
        }

        List<ReportSummaryResponse.BookingStatusCount> bookingsByStatus = new ArrayList<>();
        for (Object[] row : bookingRepository.countByStatusBetween(rangeFrom, rangeTo)) {
            bookingsByStatus.add(new ReportSummaryResponse.BookingStatusCount((BookingStatus) row[0], (Long) row[1]));
        }

        List<ReportSummaryResponse.SportBookingCount> bookingsBySport = new ArrayList<>();
        for (Object[] row : bookingRepository.countBySportBetween(rangeFrom, rangeTo)) {
            bookingsBySport.add(new ReportSummaryResponse.SportBookingCount((String) row[0], (Long) row[1]));
        }

        List<ReportSummaryResponse.RecentActivity> recentActivities = new ArrayList<>();
        for (Booking booking : bookingRepository.findTop10ByOrderByCreatedAtDesc()) {
            recentActivities.add(toRecentActivity(booking));
        }

        return new ReportSummaryResponse(rangeFrom, rangeTo, totalRevenue, revenueByDay,
                bookingsByStatus, bookingsBySport, recentActivities);
    }

    private ReportSummaryResponse.RecentActivity toRecentActivity(Booking b) {
        return new ReportSummaryResponse.RecentActivity(
                b.getId(), b.getUser().getFullName(), b.getCourt().getName(),
                b.getPlayDate(), b.getStatus(), b.getCreatedAt());
    }

    private LocalDate toLocalDate(Object raw) {
        return ((Date) raw).toLocalDate();
    }
}

