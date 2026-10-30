package com.ndnt.court_booking_backend.service;

import com.ndnt.court_booking_backend.common.dto.response.PageResponse;
import com.ndnt.court_booking_backend.common.enums.Role;
import com.ndnt.court_booking_backend.dto.request.ChangePasswordRequest;
import com.ndnt.court_booking_backend.dto.request.CreateStaffRequest;
import com.ndnt.court_booking_backend.dto.request.UpdateProfileRequest;
import com.ndnt.court_booking_backend.dto.request.UpdateUserStatusRequest;
import com.ndnt.court_booking_backend.dto.response.UserResponse;
import com.ndnt.court_booking_backend.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {

    User getEntityById(Long id);

    UserResponse getById(Long id);

    PageResponse<UserResponse> listAll(Role role, Pageable pageable);

    UserResponse updateProfile(Long userId, UpdateProfileRequest request);

    void changePassword(Long userId, ChangePasswordRequest request);

    UserResponse createStaff(CreateStaffRequest request);

    UserResponse updateStatus(Long userId, UpdateUserStatusRequest request);

    UserResponse updateAvatar(Long userId, MultipartFile file);
}

