package com.ndnt.court_booking_backend.service;

import java.math.BigDecimal;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Profile("dev")
@Service
public class MockPaymentGatewayClient implements PaymentGatewayClient {

    private final String returnUrl;

    public MockPaymentGatewayClient(@Value("${payment.mock.return-url}") String returnUrl) {
        this.returnUrl = returnUrl;
    }

    @Override
    public String methodName() {
        return "MOCK";
    }

    @Override
    public String buildPaymentUrl(Long bookingId, BigDecimal amount, String orderInfo, String clientIp) {

        return returnUrl + "?bookingId=" + bookingId + "&mockStatus=SUCCESS";
    }

    @Override
    public GatewayCallbackResult verifyCallback(Map<String, String> params) {
        Long bookingId = Long.parseLong(params.get("bookingId"));
        boolean success = "SUCCESS".equalsIgnoreCase(params.get("mockStatus"));
        return new GatewayCallbackResult(bookingId, success, success ? "00" : "99");
    }
}

