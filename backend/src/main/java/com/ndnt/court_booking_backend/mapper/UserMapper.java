package com.ndnt.court_booking_backend.mapper;

import com.ndnt.court_booking_backend.dto.response.UserResponse;
import com.ndnt.court_booking_backend.entity.User;

public final class UserMapper {

    private UserMapper() {
    }

    public static UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(), user.getFullName(), user.getEmail(), user.getPhone(),
                user.getDob(), user.getGender(), user.getRole(), user.getStatus(), user.getAvatarUrl(),
                user.getCreatedAt());
    }
}

