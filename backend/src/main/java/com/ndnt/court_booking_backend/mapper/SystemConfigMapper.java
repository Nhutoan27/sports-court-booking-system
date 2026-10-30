package com.ndnt.court_booking_backend.mapper;

import com.ndnt.court_booking_backend.dto.response.SystemConfigResponse;
import com.ndnt.court_booking_backend.entity.SystemConfig;

public final class SystemConfigMapper {

    private SystemConfigMapper() {
    }

    public static SystemConfigResponse toResponse(SystemConfig config) {
        return new SystemConfigResponse(
                config.getId(), config.getAdmin().getId(), config.getDepositPercentage(),
                config.getCancelHours(), config.getHoldMinutes(), config.getNoShowMinutes(), config.getEffectiveFrom());
    }
}

