package com.ndnt.court_booking_backend.controller;

import com.ndnt.court_booking_backend.security.SecurityUtils;
import com.ndnt.court_booking_backend.common.dto.response.ApiResponse;
import com.ndnt.court_booking_backend.common.dto.response.PageResponse;
import com.ndnt.court_booking_backend.common.enums.Role;
import com.ndnt.court_booking_backend.dto.request.ChangePasswordRequest;
import com.ndnt.court_booking_backend.dto.request.CreateStaffRequest;
import com.ndnt.court_booking_backend.dto.request.UpdateProfileRequest;
import com.ndnt.court_booking_backend.dto.request.UpdateUserStatusRequest;
import com.ndnt.court_booking_backend.dto.response.UserResponse;
import com.ndnt.court_booking_backend.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "User", description = "Quản lý tài khoản & hồ sơ cá nhân (Player/Staff/Admin dùng chung)")
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ApiResponse<UserResponse> getMe() {
        return ApiResponse.ok(userService.getById(SecurityUtils.currentUserId()));
    }

    @PatchMapping("/me")
    public ApiResponse<UserResponse> updateMe(@Valid @RequestBody UpdateProfileRequest request) {
        return ApiResponse.ok(userService.updateProfile(SecurityUtils.currentUserId(), request));
    }

    @PatchMapping("/me/password")
    public ApiResponse<Void> changeMyPassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(SecurityUtils.currentUserId(), request);
        return ApiResponse.ok("Đổi mật khẩu thành công", null);
    }

    @PostMapping(value = "/me/avatar", consumes = "multipart/form-data")
    public ApiResponse<UserResponse> updateMyAvatar(@RequestPart("file") MultipartFile file) {
        return ApiResponse.ok(userService.updateAvatar(SecurityUtils.currentUserId(), file));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ApiResponse<PageResponse<UserResponse>> listAll(
            @RequestParam(required = false) Role role,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ApiResponse.ok(userService.listAll(role, pageable));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getById(@PathVariable Long id) {
        return ApiResponse.ok(userService.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/staff")
    public ApiResponse<UserResponse> createStaff(@Valid @RequestBody CreateStaffRequest request) {
        return ApiResponse.ok("Tạo tài khoản Staff thành công", userService.createStaff(request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/status")
    public ApiResponse<UserResponse> updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateUserStatusRequest request) {
        return ApiResponse.ok(userService.updateStatus(id, request));
    }
}

