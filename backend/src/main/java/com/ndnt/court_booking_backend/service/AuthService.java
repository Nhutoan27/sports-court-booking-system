package com.ndnt.court_booking_backend.service;

import com.ndnt.court_booking_backend.dto.request.ForgotPasswordRequest;
import com.ndnt.court_booking_backend.dto.request.LoginRequest;
import com.ndnt.court_booking_backend.dto.request.RegisterRequest;
import com.ndnt.court_booking_backend.dto.request.ResetPasswordRequest;
import com.ndnt.court_booking_backend.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);
}

