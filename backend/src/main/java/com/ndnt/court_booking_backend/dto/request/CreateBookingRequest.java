package com.ndnt.court_booking_backend.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateBookingRequest {

    @NotNull
    private Long courtId;

    @NotNull
    private LocalDate playDate;

    @NotEmpty
    private List<Long> timeSlotIds;
}

