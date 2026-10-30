package com.ndnt.court_booking_backend.dto.request;

import jakarta.validation.constraints.NotNull;
import java.time.LocalTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TimeSlotRequest {

    @NotNull
    private LocalTime startTime;

    @NotNull
    private LocalTime endTime;
}

