package com.ndnt.court_booking_backend.controller;

import com.ndnt.court_booking_backend.common.dto.response.ApiResponse;
import com.ndnt.court_booking_backend.dto.request.TimeSlotRequest;
import com.ndnt.court_booking_backend.dto.response.TimeSlotResponse;
import com.ndnt.court_booking_backend.service.TimeSlotService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "TimeSlot", description = "Khung giờ theo từng sân — đọc công khai, sửa chỉ Admin")
@RestController
@RequestMapping("/time-slots")
public class TimeSlotController {

    private final TimeSlotService timeSlotService;

    public TimeSlotController(TimeSlotService timeSlotService) {
        this.timeSlotService = timeSlotService;
    }

    @GetMapping
    public ApiResponse<List<TimeSlotResponse>> listByCourt(@RequestParam Long courtId) {
        return ApiResponse.ok(timeSlotService.listByCourt(courtId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ApiResponse<TimeSlotResponse> create(@RequestParam Long courtId, @Valid @RequestBody TimeSlotRequest request) {
        return ApiResponse.ok("Tạo khung giờ thành công", timeSlotService.create(courtId, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}")
    public ApiResponse<TimeSlotResponse> update(@PathVariable Long id, @Valid @RequestBody TimeSlotRequest request) {
        return ApiResponse.ok(timeSlotService.update(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        timeSlotService.delete(id);
        return ApiResponse.ok("Xoá khung giờ thành công", null);
    }
}

