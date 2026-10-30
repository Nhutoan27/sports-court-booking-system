package com.ndnt.court_booking_backend.dto.response;

import com.ndnt.court_booking_backend.common.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;
    private String tokenType;
    private Long userId;
    private String fullName;
    private String email;
    private Role role;

    public static AuthResponse of(String accessToken, Long userId, String fullName, String email, Role role) {
        return new AuthResponse(accessToken, "Bearer", userId, fullName, email, role);
    }
}

