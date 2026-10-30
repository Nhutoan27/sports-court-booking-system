package com.ndnt.court_booking_backend.service.impl;

import com.ndnt.court_booking_backend.common.exception.ResourceNotFoundException;
import com.ndnt.court_booking_backend.dto.request.TimeSlotRequest;
import com.ndnt.court_booking_backend.dto.response.TimeSlotResponse;
import com.ndnt.court_booking_backend.entity.TimeSlot;
import com.ndnt.court_booking_backend.mapper.TimeSlotMapper;
import com.ndnt.court_booking_backend.repository.TimeSlotRepository;
import com.ndnt.court_booking_backend.service.CourtService;
import com.ndnt.court_booking_backend.service.TimeSlotService;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TimeSlotServiceImpl implements TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;
    private final CourtService courtService;

    public TimeSlotServiceImpl(TimeSlotRepository timeSlotRepository, CourtService courtService) {
        this.timeSlotRepository = timeSlotRepository;
        this.courtService = courtService;
    }

    @Override
    public TimeSlot getEntityById(Long id) {
        return timeSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khung giờ"));
    }

    @Override
    public List<TimeSlotResponse> listByCourt(Long courtId) {
        List<TimeSlotResponse> result = new ArrayList<>();
        for (TimeSlot timeSlot : timeSlotRepository.findByCourtIdOrderByStartTime(courtId)) {
            result.add(TimeSlotMapper.toResponse(timeSlot));
        }
        return result;
    }

    @Override
    @Transactional
    public TimeSlotResponse create(Long courtId, TimeSlotRequest request) {
        TimeSlot timeSlot = new TimeSlot();
        timeSlot.setCourt(courtService.getEntityById(courtId));
        timeSlot.setStartTime(request.getStartTime());
        timeSlot.setEndTime(request.getEndTime());
        return TimeSlotMapper.toResponse(timeSlotRepository.save(timeSlot));
    }

    @Override
    @Transactional
    public TimeSlotResponse update(Long id, TimeSlotRequest request) {
        TimeSlot timeSlot = getEntityById(id);
        timeSlot.setStartTime(request.getStartTime());
        timeSlot.setEndTime(request.getEndTime());
        return TimeSlotMapper.toResponse(timeSlot);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        timeSlotRepository.delete(getEntityById(id));
    }
}

