package com.ndnt.court_booking_backend.controller;

import com.ndnt.court_booking_backend.security.SecurityUtils;
import com.ndnt.court_booking_backend.common.dto.response.ApiResponse;
import com.ndnt.court_booking_backend.dto.request.PlayerProfileRequest;
import com.ndnt.court_booking_backend.dto.response.PlayerProfileResponse;
import com.ndnt.court_booking_backend.service.PlayerProfileService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "PlayerProfile", description = "Hồ sơ chơi của Player — dữ liệu đầu vào cho matching (UC-10)")
@RestController
@RequestMapping("/player-profiles")
public class PlayerProfileController {

    private final PlayerProfileService playerProfileService;

    public PlayerProfileController(PlayerProfileService playerProfileService) {
        this.playerProfileService = playerProfileService;
    }

    @PreAuthorize("hasRole('PLAYER')")
    @GetMapping("/me")
    public ApiResponse<PlayerProfileResponse> getMine() {
        return ApiResponse.ok(playerProfileService.getMine(SecurityUtils.currentUserId()));
    }

    @PreAuthorize("hasRole('PLAYER')")
    @PatchMapping("/me")
    public ApiResponse<PlayerProfileResponse> upsertMine(@Valid @RequestBody PlayerProfileRequest request) {
        return ApiResponse.ok(playerProfileService.upsert(SecurityUtils.currentUserId(), request));
    }
}

