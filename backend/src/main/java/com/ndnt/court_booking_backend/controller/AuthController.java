package com.ndnt.court_booking_backend.controller;

import com.ndnt.court_booking_backend.common.dto.response.ApiResponse;
import com.ndnt.court_booking_backend.dto.request.ForgotPasswordRequest;
import com.ndnt.court_booking_backend.dto.request.LoginRequest;
import com.ndnt.court_booking_backend.dto.request.RegisterRequest;
import com.ndnt.court_booking_backend.dto.request.ResetPasswordRequest;
import com.ndnt.court_booking_backend.dto.response.AuthResponse;
import com.ndnt.court_booking_backend.service.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Auth", description = "Đăng ký (chỉ Player — UC-01) / Đăng nhập (Player/Staff/Admin — UC-02) / Quên mật khẩu (OTP)")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.ok("Đăng ký thành công", authService.register(request));
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.ok(authService.login(request));
    }

    @PostMapping("/forgot-password")
    public ApiResponse<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ApiResponse.ok("Mã OTP đã được gửi tới email của bạn", null);
    }

    @PostMapping("/reset-password")
    public ApiResponse<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ApiResponse.ok("Đặt lại mật khẩu thành công", null);
    }
}

