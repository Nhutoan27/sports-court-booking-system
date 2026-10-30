package com.ndnt.court_booking_backend.service;

import com.ndnt.court_booking_backend.dto.request.CourtRequest;
import com.ndnt.court_booking_backend.dto.request.StatusRequest;
import com.ndnt.court_booking_backend.dto.response.CourtResponse;
import com.ndnt.court_booking_backend.entity.Court;
import java.util.List;

public interface CourtService {

    Court getEntityById(Long id);

    List<CourtResponse> listAll(Long sportId);

    CourtResponse getById(Long id);

    CourtResponse create(CourtRequest request);

    CourtResponse update(Long id, CourtRequest request);

    CourtResponse updateStatus(Long id, StatusRequest request);
}

