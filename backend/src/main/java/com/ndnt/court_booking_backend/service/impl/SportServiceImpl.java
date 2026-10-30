package com.ndnt.court_booking_backend.service.impl;

import com.ndnt.court_booking_backend.common.exception.ResourceNotFoundException;
import com.ndnt.court_booking_backend.dto.request.SportRequest;
import com.ndnt.court_booking_backend.dto.request.StatusRequest;
import com.ndnt.court_booking_backend.dto.response.SportResponse;
import com.ndnt.court_booking_backend.entity.Sport;
import com.ndnt.court_booking_backend.mapper.CourtMapper;
import com.ndnt.court_booking_backend.repository.SportRepository;
import com.ndnt.court_booking_backend.service.SportService;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SportServiceImpl implements SportService {

    private final SportRepository sportRepository;

    public SportServiceImpl(SportRepository sportRepository) {
        this.sportRepository = sportRepository;
    }

    @Override
    public Sport getEntityById(Long id) {
        return sportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy môn thể thao"));
    }

    @Override
    public List<SportResponse> listAll() {
        List<SportResponse> result = new ArrayList<>();
        for (Sport sport : sportRepository.findAll()) {
            result.add(CourtMapper.toResponse(sport));
        }
        return result;
    }

    @Override
    public SportResponse getById(Long id) {
        return CourtMapper.toResponse(getEntityById(id));
    }

    @Override
    @Transactional
    public SportResponse create(SportRequest request) {
        Sport sport = new Sport();
        sport.setName(request.getName());
        sport.setStatus("ACTIVE");
        return CourtMapper.toResponse(sportRepository.save(sport));
    }

    @Override
    @Transactional
    public SportResponse update(Long id, SportRequest request) {
        Sport sport = getEntityById(id);
        sport.setName(request.getName());
        return CourtMapper.toResponse(sport);
    }

    @Override
    @Transactional
    public SportResponse updateStatus(Long id, StatusRequest request) {
        Sport sport = getEntityById(id);
        sport.setStatus(request.getStatus());
        return CourtMapper.toResponse(sport);
    }
}

