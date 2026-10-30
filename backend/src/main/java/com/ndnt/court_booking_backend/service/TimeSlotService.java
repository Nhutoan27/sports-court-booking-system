package com.ndnt.court_booking_backend.service;

import com.ndnt.court_booking_backend.dto.request.TimeSlotRequest;
import com.ndnt.court_booking_backend.dto.response.TimeSlotResponse;
import com.ndnt.court_booking_backend.entity.TimeSlot;
import java.util.List;

public interface TimeSlotService {

    TimeSlot getEntityById(Long id);

    List<TimeSlotResponse> listByCourt(Long courtId);

    TimeSlotResponse create(Long courtId, TimeSlotRequest request);

    TimeSlotResponse update(Long id, TimeSlotRequest request);

    void delete(Long id);
}

