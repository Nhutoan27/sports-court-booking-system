package com.ndnt.court_booking_backend.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.ndnt.court_booking_backend.common.dto.response.PageResponse;
import com.ndnt.court_booking_backend.common.enums.Role;
import com.ndnt.court_booking_backend.common.exception.BusinessRuleViolationException;
import com.ndnt.court_booking_backend.common.exception.ResourceNotFoundException;
import com.ndnt.court_booking_backend.dto.request.ChangePasswordRequest;
import com.ndnt.court_booking_backend.dto.request.CreateStaffRequest;
import com.ndnt.court_booking_backend.dto.request.UpdateProfileRequest;
import com.ndnt.court_booking_backend.dto.request.UpdateUserStatusRequest;
import com.ndnt.court_booking_backend.dto.response.UserResponse;
import com.ndnt.court_booking_backend.entity.User;
import com.ndnt.court_booking_backend.mapper.UserMapper;
import com.ndnt.court_booking_backend.repository.UserRepository;
import com.ndnt.court_booking_backend.service.UserService;
import java.io.IOException;
import java.util.Map;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserServiceImpl implements UserService {

    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    private static final long MAX_AVATAR_SIZE_BYTES = 5L * 1024 * 1024;
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of("image/jpeg", "image/png", "image/webp");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Cloudinary cloudinary;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, Cloudinary cloudinary) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.cloudinary = cloudinary;
    }

    @Override
    public User getEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));
    }

    @Override
    public UserResponse getById(Long id) {
        return UserMapper.toResponse(getEntityById(id));
    }

    @Override
    public PageResponse<UserResponse> listAll(Role role, Pageable pageable) {
        Page<User> users = role != null ? userRepository.findByRole(role, pageable) : userRepository.findAll(pageable);
        return PageResponse.from(users.map(user -> UserMapper.toResponse(user)));
    }

    @Override
    @Transactional
    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = getEntityById(userId);
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setDob(request.getDob());
        user.setGender(request.getGender());
        return UserMapper.toResponse(user);
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = getEntityById(userId);
        if (!user.matchesPassword(request.getCurrentPassword(), passwordEncoder)) {
            throw new BusinessRuleViolationException("Mật khẩu hiện tại không đúng");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    }

    @Override
    @Transactional
    public UserResponse createStaff(CreateStaffRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessRuleViolationException("Email đã được sử dụng");
        }
        User staff = new User();
        staff.setFullName(request.getFullName());
        staff.setEmail(request.getEmail());
        staff.setPassword(passwordEncoder.encode(request.getPassword()));
        staff.setPhone(request.getPhone());
        staff.setRole(Role.STAFF);
        staff.setStatus("ACTIVE");
        return UserMapper.toResponse(userRepository.save(staff));
    }

    @Override
    @Transactional
    public UserResponse updateStatus(Long userId, UpdateUserStatusRequest request) {
        User user = getEntityById(userId);
        user.setStatus(request.getStatus());
        return UserMapper.toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateAvatar(Long userId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessRuleViolationException("Vui lòng chọn file ảnh");
        }
        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new BusinessRuleViolationException("Chỉ chấp nhận ảnh JPEG/PNG/WebP");
        }
        if (file.getSize() > MAX_AVATAR_SIZE_BYTES) {
            throw new BusinessRuleViolationException("Kích thước ảnh tối đa 5MB");
        }

        User user = getEntityById(userId);
        try {
            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "avatars/" + userId,
                    "overwrite", true,
                    "resource_type", "image"));
            user.setAvatarUrl((String) result.get("secure_url"));
        } catch (IOException e) {
            log.error("UserServiceImpl: upload avatar lên Cloudinary thất bại cho user {}", userId, e);
            throw new BusinessRuleViolationException("Upload avatar thất bại, vui lòng thử lại");
        }
        return UserMapper.toResponse(user);
    }
}

