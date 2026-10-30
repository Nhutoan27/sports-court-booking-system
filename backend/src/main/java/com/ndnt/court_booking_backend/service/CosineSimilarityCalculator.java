package com.ndnt.court_booking_backend.service;

import com.ndnt.court_booking_backend.entity.MatchingRequest;

public interface CosineSimilarityCalculator {

    double similarity(MatchingRequest a, MatchingRequest b);

    float[] encode(MatchingRequest request);
}

