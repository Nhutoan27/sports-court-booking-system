package com.ndnt.court_booking_backend.service;

import java.math.BigDecimal;
import java.util.Map;

public interface PaymentGatewayClient {

    String methodName();

    String buildPaymentUrl(Long bookingId, BigDecimal amount, String orderInfo, String clientIp);

    GatewayCallbackResult verifyCallback(Map<String, String> params);
}

