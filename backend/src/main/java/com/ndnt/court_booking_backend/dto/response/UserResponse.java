package com.ndnt.court_booking_backend.dto.response;

import com.ndnt.court_booking_backend.common.enums.Role;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private LocalDate dob;
    private String gender;
    private Role role;
    private String status;
    private String avatarUrl;

    private LocalDateTime createdAt;
}

