package com.ndnt.court_booking_backend.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SystemConfigResponse {
    private Long id;
    private Long adminId;
    private BigDecimal depositPercentage;
    private int cancelHours;
    private int holdMinutes;
    private int noShowMinutes;
    private LocalDateTime effectiveFrom;
}

