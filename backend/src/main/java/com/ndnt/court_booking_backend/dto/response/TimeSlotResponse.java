package com.ndnt.court_booking_backend.dto.response;

import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TimeSlotResponse {
    private Long id;
    private Long courtId;
    private LocalTime startTime;
    private LocalTime endTime;
}

