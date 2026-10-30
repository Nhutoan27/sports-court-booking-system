package com.ndnt.court_booking_backend.service;

public interface OtpMailSender {

    void send(String toEmail, String otpCode);
}

