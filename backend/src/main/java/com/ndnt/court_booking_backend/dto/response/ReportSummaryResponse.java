package com.ndnt.court_booking_backend.dto.response;

import com.ndnt.court_booking_backend.common.enums.BookingStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReportSummaryResponse {

    private LocalDate from;
    private LocalDate to;
    private BigDecimal totalRevenue;
    private List<RevenueByDay> revenueByDay;
    private List<BookingStatusCount> bookingsByStatus;
    private List<SportBookingCount> bookingsBySport;
    private List<RecentActivity> recentActivities;

    @Getter
    @AllArgsConstructor
    public static class RevenueByDay {
        private LocalDate date;
        private BigDecimal amount;
    }

    @Getter
    @AllArgsConstructor
    public static class BookingStatusCount {
        private BookingStatus status;
        private long count;
    }

    @Getter
    @AllArgsConstructor
    public static class SportBookingCount {
        private String sportName;
        private long count;
    }

    @Getter
    @AllArgsConstructor
    public static class RecentActivity {
        private Long bookingId;
        private String userName;
        private String courtName;
        private LocalDate playDate;
        private BookingStatus status;
        private LocalDateTime createdAt;
    }
}

