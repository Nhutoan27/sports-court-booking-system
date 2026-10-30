package com.ndnt.court_booking_backend.service;

import com.ndnt.court_booking_backend.dto.request.CourtPriceRequest;
import com.ndnt.court_booking_backend.dto.response.CourtPriceResponse;
import java.util.List;

public interface CourtPriceService {

    List<CourtPriceResponse> listByCourt(Long courtId);

    CourtPriceResponse create(Long courtId, CourtPriceRequest request);

    void delete(Long id);
}

