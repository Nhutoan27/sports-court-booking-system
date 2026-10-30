package com.ndnt.court_booking_backend.mapper;

import com.ndnt.court_booking_backend.dto.response.TimeSlotResponse;
import com.ndnt.court_booking_backend.entity.TimeSlot;

public final class TimeSlotMapper {

    private TimeSlotMapper() {
    }

    public static TimeSlotResponse toResponse(TimeSlot timeSlot) {
        return new TimeSlotResponse(
                timeSlot.getId(), timeSlot.getCourt().getId(), timeSlot.getStartTime(), timeSlot.getEndTime());
    }
}

