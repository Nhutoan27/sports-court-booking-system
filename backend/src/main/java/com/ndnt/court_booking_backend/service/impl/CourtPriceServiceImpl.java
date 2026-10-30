package com.ndnt.court_booking_backend.service.impl;

import com.ndnt.court_booking_backend.common.exception.ResourceNotFoundException;
import com.ndnt.court_booking_backend.dto.request.CourtPriceRequest;
import com.ndnt.court_booking_backend.dto.response.CourtPriceResponse;
import com.ndnt.court_booking_backend.entity.CourtPrice;
import com.ndnt.court_booking_backend.mapper.CourtMapper;
import com.ndnt.court_booking_backend.repository.CourtPriceRepository;
import com.ndnt.court_booking_backend.service.CourtPriceService;
import com.ndnt.court_booking_backend.service.CourtService;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CourtPriceServiceImpl implements CourtPriceService {

    private final CourtPriceRepository courtPriceRepository;
    private final CourtService courtService;

    public CourtPriceServiceImpl(CourtPriceRepository courtPriceRepository, CourtService courtService) {
        this.courtPriceRepository = courtPriceRepository;
        this.courtService = courtService;
    }

    @Override
    public List<CourtPriceResponse> listByCourt(Long courtId) {
        List<CourtPriceResponse> result = new ArrayList<>();
        for (CourtPrice price : courtPriceRepository.findByCourtId(courtId)) {
            result.add(CourtMapper.toResponse(price));
        }
        return result;
    }

    @Override
    @Transactional
    public CourtPriceResponse create(Long courtId, CourtPriceRequest request) {
        CourtPrice price = new CourtPrice();
        price.setCourt(courtService.getEntityById(courtId));
        price.setRangeStart(request.getRangeStart());
        price.setRangeEnd(request.getRangeEnd());
        price.setPrice(request.getPrice());
        return CourtMapper.toResponse(courtPriceRepository.save(price));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        CourtPrice price = courtPriceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mức giá"));
        courtPriceRepository.delete(price);
    }
}

