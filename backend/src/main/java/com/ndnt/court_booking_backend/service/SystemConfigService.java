package com.ndnt.court_booking_backend.service;

import com.ndnt.court_booking_backend.dto.request.SystemConfigRequest;
import com.ndnt.court_booking_backend.dto.response.SystemConfigResponse;
import com.ndnt.court_booking_backend.entity.SystemConfig;
import java.util.List;

public interface SystemConfigService {

    SystemConfig getCurrentEffective();

    SystemConfigResponse getCurrent();

    List<SystemConfigResponse> getHistory();

    SystemConfigResponse create(Long adminId, SystemConfigRequest request);
}

