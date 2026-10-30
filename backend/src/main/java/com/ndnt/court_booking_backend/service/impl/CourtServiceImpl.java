package com.ndnt.court_booking_backend.service.impl;

import com.ndnt.court_booking_backend.common.exception.ResourceNotFoundException;
import com.ndnt.court_booking_backend.dto.request.CourtRequest;
import com.ndnt.court_booking_backend.dto.request.StatusRequest;
import com.ndnt.court_booking_backend.dto.response.CourtResponse;
import com.ndnt.court_booking_backend.entity.Court;
import com.ndnt.court_booking_backend.mapper.CourtMapper;
import com.ndnt.court_booking_backend.repository.CourtRepository;
import com.ndnt.court_booking_backend.service.CourtService;
import com.ndnt.court_booking_backend.service.SportService;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CourtServiceImpl implements CourtService {

    private final CourtRepository courtRepository;
    private final SportService sportService;

    public CourtServiceImpl(CourtRepository courtRepository, SportService sportService) {
        this.courtRepository = courtRepository;
        this.sportService = sportService;
    }

    @Override
    public Court getEntityById(Long id) {
        return courtRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sân"));
    }

    @Override
    public List<CourtResponse> listAll(Long sportId) {
        List<Court> courts = sportId != null ? courtRepository.findBySportId(sportId) : courtRepository.findAll();
        List<CourtResponse> result = new ArrayList<>();
        for (Court court : courts) {
            result.add(CourtMapper.toResponse(court));
        }
        return result;
    }

    @Override
    public CourtResponse getById(Long id) {
        return CourtMapper.toResponse(getEntityById(id));
    }

    @Override
    @Transactional
    public CourtResponse create(CourtRequest request) {
        Court court = new Court();
        court.setSport(sportService.getEntityById(request.getSportId()));
        court.setName(request.getName());
        court.setStatus("ACTIVE");
        return CourtMapper.toResponse(courtRepository.save(court));
    }

    @Override
    @Transactional
    public CourtResponse update(Long id, CourtRequest request) {
        Court court = getEntityById(id);
        court.setSport(sportService.getEntityById(request.getSportId()));
        court.setName(request.getName());
        return CourtMapper.toResponse(court);
    }

    @Override
    @Transactional
    public CourtResponse updateStatus(Long id, StatusRequest request) {
        Court court = getEntityById(id);
        court.setStatus(request.getStatus());
        return CourtMapper.toResponse(court);
    }
}

