package com.ndnt.court_booking_backend.service;

import com.ndnt.court_booking_backend.dto.response.ReportSummaryResponse;
import java.time.LocalDate;

public interface ReportService {

    ReportSummaryResponse getSummary(LocalDate from, LocalDate to);
}

