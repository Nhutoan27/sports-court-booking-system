package com.ndnt.court_booking_backend.service.impl;

import com.ndnt.court_booking_backend.common.exception.ResourceNotFoundException;
import com.ndnt.court_booking_backend.dto.request.SystemConfigRequest;
import com.ndnt.court_booking_backend.dto.response.SystemConfigResponse;
import com.ndnt.court_booking_backend.entity.SystemConfig;
import com.ndnt.court_booking_backend.mapper.SystemConfigMapper;
import com.ndnt.court_booking_backend.repository.SystemConfigRepository;
import com.ndnt.court_booking_backend.service.SystemConfigService;
import com.ndnt.court_booking_backend.service.UserService;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SystemConfigServiceImpl implements SystemConfigService {

    private final SystemConfigRepository systemConfigRepository;
    private final UserService userService;

    public SystemConfigServiceImpl(SystemConfigRepository systemConfigRepository, UserService userService) {
        this.systemConfigRepository = systemConfigRepository;
        this.userService = userService;
    }

    @Override
    public SystemConfig getCurrentEffective() {
        return systemConfigRepository.findFirstByEffectiveFromLessThanEqualOrderByEffectiveFromDesc(LocalDateTime.now())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Chưa có SystemConfig nào hiệu lực — Admin cần tạo cấu hình policy trước (BR-12/13)"));
    }

    @Override
    public SystemConfigResponse getCurrent() {
        return SystemConfigMapper.toResponse(getCurrentEffective());
    }

    @Override
    public List<SystemConfigResponse> getHistory() {
        List<SystemConfigResponse> result = new ArrayList<>();
        for (SystemConfig config : systemConfigRepository.findAllByOrderByEffectiveFromDesc()) {
            result.add(SystemConfigMapper.toResponse(config));
        }
        return result;
    }

    @Override
    @Transactional
    public SystemConfigResponse create(Long adminId, SystemConfigRequest request) {
        SystemConfig config = new SystemConfig();
        config.setAdmin(userService.getEntityById(adminId));
        config.setDepositPercentage(request.getDepositPercentage());
        config.setCancelHours(request.getCancelHours());
        config.setHoldMinutes(request.getHoldMinutes());
        config.setNoShowMinutes(request.getNoShowMinutes());
        config.setEffectiveFrom(request.getEffectiveFrom());
        return SystemConfigMapper.toResponse(systemConfigRepository.save(config));
    }
}

