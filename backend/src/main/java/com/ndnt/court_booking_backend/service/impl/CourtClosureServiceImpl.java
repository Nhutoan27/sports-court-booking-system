package com.ndnt.court_booking_backend.service.impl;

import com.ndnt.court_booking_backend.common.exception.ResourceNotFoundException;
import com.ndnt.court_booking_backend.dto.request.CourtClosureRequest;
import com.ndnt.court_booking_backend.dto.response.CourtClosureResponse;
import com.ndnt.court_booking_backend.entity.CourtClosure;
import com.ndnt.court_booking_backend.mapper.CourtMapper;
import com.ndnt.court_booking_backend.repository.CourtClosureRepository;
import com.ndnt.court_booking_backend.service.CourtClosureService;
import com.ndnt.court_booking_backend.service.CourtService;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CourtClosureServiceImpl implements CourtClosureService {

    private final CourtClosureRepository courtClosureRepository;
    private final CourtService courtService;

    public CourtClosureServiceImpl(CourtClosureRepository courtClosureRepository, CourtService courtService) {
        this.courtClosureRepository = courtClosureRepository;
        this.courtService = courtService;
    }

    @Override
    public List<CourtClosureResponse> listByCourt(Long courtId) {
        List<CourtClosureResponse> result = new ArrayList<>();
        for (CourtClosure closure : courtClosureRepository.findByCourtId(courtId)) {
            result.add(CourtMapper.toResponse(closure));
        }
        return result;
    }

    @Override
    @Transactional
    public CourtClosureResponse create(Long courtId, CourtClosureRequest request) {
        CourtClosure closure = new CourtClosure();
        closure.setCourt(courtService.getEntityById(courtId));
        closure.setStartTime(request.getStartTime());
        closure.setEndTime(request.getEndTime());
        return CourtMapper.toResponse(courtClosureRepository.save(closure));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        CourtClosure closure = courtClosureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lịch đóng sân"));
        courtClosureRepository.delete(closure);
    }
}

