package com.ndnt.court_booking_backend.service;

import com.ndnt.court_booking_backend.dto.request.SportRequest;
import com.ndnt.court_booking_backend.dto.request.StatusRequest;
import com.ndnt.court_booking_backend.dto.response.SportResponse;
import com.ndnt.court_booking_backend.entity.Sport;
import java.util.List;

public interface SportService {

    Sport getEntityById(Long id);

    List<SportResponse> listAll();

    SportResponse getById(Long id);

    SportResponse create(SportRequest request);

    SportResponse update(Long id, SportRequest request);

    SportResponse updateStatus(Long id, StatusRequest request);
}

