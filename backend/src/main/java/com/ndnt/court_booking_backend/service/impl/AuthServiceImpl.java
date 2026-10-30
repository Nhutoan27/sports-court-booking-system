package com.ndnt.court_booking_backend.service.impl;

import com.ndnt.court_booking_backend.dto.request.ForgotPasswordRequest;
import com.ndnt.court_booking_backend.dto.request.LoginRequest;
import com.ndnt.court_booking_backend.dto.request.RegisterRequest;
import com.ndnt.court_booking_backend.dto.request.ResetPasswordRequest;
import com.ndnt.court_booking_backend.dto.response.AuthResponse;
import com.ndnt.court_booking_backend.security.JwtTokenProvider;
import com.ndnt.court_booking_backend.security.OtpStore;
import com.ndnt.court_booking_backend.service.AuthService;
import com.ndnt.court_booking_backend.service.OtpMailSender;
import com.ndnt.court_booking_backend.common.enums.Role;
import com.ndnt.court_booking_backend.common.exception.BusinessRuleViolationException;
import com.ndnt.court_booking_backend.common.exception.ResourceNotFoundException;
import com.ndnt.court_booking_backend.common.exception.UnauthorizedException;
import com.ndnt.court_booking_backend.entity.User;
import com.ndnt.court_booking_backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final OtpStore otpStore;
    private final OtpMailSender otpMailSender;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
                            JwtTokenProvider jwtTokenProvider, OtpStore otpStore, OtpMailSender otpMailSender) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.otpStore = otpStore;
        this.otpMailSender = otpMailSender;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessRuleViolationException("Email đã được sử dụng");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(Role.PLAYER);
        user.setStatus("ACTIVE");
        user = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user);
        return AuthResponse.of(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Email hoặc mật khẩu không đúng"));

        if (!user.matchesPassword(request.getPassword(), passwordEncoder)) {
            throw new UnauthorizedException("Email hoặc mật khẩu không đúng");
        }

        String token = jwtTokenProvider.generateToken(user);
        return AuthResponse.of(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Email chưa được đăng ký"));
        String otp = otpStore.generate(user.getEmail());
        otpMailSender.send(user.getEmail(), otp);
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Email chưa được đăng ký"));
        if (!otpStore.verify(user.getEmail(), request.getOtp())) {
            throw new BusinessRuleViolationException("Mã OTP không đúng hoặc đã hết hạn");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}

