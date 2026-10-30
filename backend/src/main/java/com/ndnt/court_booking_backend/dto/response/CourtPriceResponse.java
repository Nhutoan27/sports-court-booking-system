package com.ndnt.court_booking_backend.dto.response;

import java.math.BigDecimal;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CourtPriceResponse {
    private Long id;
    private Long courtId;
    private LocalTime rangeStart;
    private LocalTime rangeEnd;
    private BigDecimal price;
}

