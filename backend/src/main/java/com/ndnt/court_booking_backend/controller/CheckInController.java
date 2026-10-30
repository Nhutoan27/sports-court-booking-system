package com.ndnt.court_booking_backend.controller;

import com.ndnt.court_booking_backend.security.SecurityUtils;
import com.ndnt.court_booking_backend.common.dto.response.ApiResponse;
import com.ndnt.court_booking_backend.dto.response.CheckInResponse;
import com.ndnt.court_booking_backend.service.CheckInService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "CheckIn", description = "Staff check-in cho booking — BR-07 (Đã xác nhận → Đã check-in)")
@PreAuthorize("hasRole('STAFF')")
@RestController
@RequestMapping("/check-ins")
public class CheckInController {

    private final CheckInService checkInService;

    public CheckInController(CheckInService checkInService) {
        this.checkInService = checkInService;
    }

    @PostMapping
    public ApiResponse<CheckInResponse> checkIn(@RequestParam Long bookingId) {
        CheckInResponse created = checkInService.checkIn(SecurityUtils.currentUserId(), bookingId);
        return ApiResponse.ok("Check-in thành công", created);
    }
}

