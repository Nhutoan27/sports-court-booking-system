package com.ndnt.court_booking_backend.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SystemConfigRequest {

    @NotNull
    @DecimalMin(value = "0", inclusive = false)
    private BigDecimal depositPercentage;

    @NotNull
    @Min(0)
    private Integer cancelHours;

    @NotNull
    @Min(1)
    private Integer holdMinutes;

    @NotNull
    @Min(0)
    private Integer noShowMinutes;

    @NotNull
    private LocalDateTime effectiveFrom;
}

