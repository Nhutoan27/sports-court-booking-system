package com.ndnt.court_booking_backend.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourtPriceRequest {

    @NotNull
    private LocalTime rangeStart;

    @NotNull
    private LocalTime rangeEnd;

    @NotNull
    @DecimalMin(value = "0", inclusive = false)
    private BigDecimal price;
}

