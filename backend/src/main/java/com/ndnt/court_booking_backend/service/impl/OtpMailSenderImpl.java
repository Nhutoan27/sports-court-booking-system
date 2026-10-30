package com.ndnt.court_booking_backend.service.impl;

import com.ndnt.court_booking_backend.service.OtpMailSender;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class OtpMailSenderImpl implements OtpMailSender {

    private static final Logger log = LoggerFactory.getLogger(OtpMailSenderImpl.class);

    private final JavaMailSender mailSender;
    private final String fromAddress;

    public OtpMailSenderImpl(JavaMailSender mailSender, @Value("${spring.mail.username:}") String fromAddress) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
    }

    @Override
    public void send(String toEmail, String otpCode) {
        if (fromAddress.isBlank()) {
            log.warn("[MOCK OTP] MAIL_USERNAME/MAIL_PASSWORD chưa cấu hình -> gửi tới {}: mã xác nhận đặt lại "
                    + "mật khẩu là {} (hết hạn sau vài phút). Điền 2 biến đó (env var hoặc "
                    + "backend/secrets.properties) để gửi email thật.", toEmail, otpCode);
            return;
        }
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(toEmail);
        message.setSubject("Mã xác nhận đặt lại mật khẩu — Sports Court Booking");
        message.setText("Mã OTP của bạn là: " + otpCode
                + "\n\nMã có hiệu lực trong vài phút, không chia sẻ mã này cho bất kỳ ai.");
        mailSender.send(message);
    }
}

