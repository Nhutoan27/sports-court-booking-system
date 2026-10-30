package com.ndnt.court_booking_backend.service;

import com.ndnt.court_booking_backend.dto.request.CourtClosureRequest;
import com.ndnt.court_booking_backend.dto.response.CourtClosureResponse;
import java.util.List;

public interface CourtClosureService {

    List<CourtClosureResponse> listByCourt(Long courtId);

    CourtClosureResponse create(Long courtId, CourtClosureRequest request);

    void delete(Long id);
}

