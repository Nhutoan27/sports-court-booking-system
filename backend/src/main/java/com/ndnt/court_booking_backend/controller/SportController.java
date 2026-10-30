package com.ndnt.court_booking_backend.controller;

import com.ndnt.court_booking_backend.common.dto.response.ApiResponse;
import com.ndnt.court_booking_backend.dto.request.SportRequest;
import com.ndnt.court_booking_backend.dto.request.StatusRequest;
import com.ndnt.court_booking_backend.dto.response.SportResponse;
import com.ndnt.court_booking_backend.service.SportService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Sport", description = "Môn thể thao (cầu lông, pickleball...) — đọc công khai, sửa chỉ Admin")
@RestController
@RequestMapping("/sports")
public class SportController {

    private final SportService sportService;

    public SportController(SportService sportService) {
        this.sportService = sportService;
    }

    @GetMapping
    public ApiResponse<List<SportResponse>> listAll() {
        return ApiResponse.ok(sportService.listAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<SportResponse> getById(@PathVariable Long id) {
        return ApiResponse.ok(sportService.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ApiResponse<SportResponse> create(@Valid @RequestBody SportRequest request) {
        return ApiResponse.ok("Tạo môn thể thao thành công", sportService.create(request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}")
    public ApiResponse<SportResponse> update(@PathVariable Long id, @Valid @RequestBody SportRequest request) {
        return ApiResponse.ok(sportService.update(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/status")
    public ApiResponse<SportResponse> updateStatus(@PathVariable Long id, @Valid @RequestBody StatusRequest request) {
        return ApiResponse.ok(sportService.updateStatus(id, request));
    }
}

