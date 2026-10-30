package com.ndnt.court_booking_backend.controller;

import com.ndnt.court_booking_backend.security.SecurityUtils;
import com.ndnt.court_booking_backend.common.dto.response.ApiResponse;
import com.ndnt.court_booking_backend.dto.request.SystemConfigRequest;
import com.ndnt.court_booking_backend.dto.response.SystemConfigResponse;
import com.ndnt.court_booking_backend.service.SystemConfigService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "SystemConfig", description = "Cấu hình policy hệ thống (%cọc, giờ huỷ, phút giữ chỗ, phút no-show) — BR-12/13")
@PreAuthorize("hasRole('ADMIN')")
@RestController
@RequestMapping("/system-config")
public class SystemConfigController {

    private final SystemConfigService systemConfigService;

    public SystemConfigController(SystemConfigService systemConfigService) {
        this.systemConfigService = systemConfigService;
    }

    @GetMapping
    public ApiResponse<SystemConfigResponse> getCurrent() {
        return ApiResponse.ok(systemConfigService.getCurrent());
    }

    @GetMapping("/history")
    public ApiResponse<List<SystemConfigResponse>> getHistory() {
        return ApiResponse.ok(systemConfigService.getHistory());
    }

    @PostMapping
    public ApiResponse<SystemConfigResponse> create(@Valid @RequestBody SystemConfigRequest request) {
        SystemConfigResponse created = systemConfigService.create(SecurityUtils.currentUserId(), request);
        return ApiResponse.ok("Tạo cấu hình mới thành công", created);
    }
}

