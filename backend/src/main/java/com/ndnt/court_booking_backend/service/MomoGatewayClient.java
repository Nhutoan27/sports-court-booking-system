package com.ndnt.court_booking_backend.service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Profile("!dev")
@Service
public class MomoGatewayClient implements PaymentGatewayClient {

    private static final Logger log = LoggerFactory.getLogger(MomoGatewayClient.class);
    private static final String REQUEST_TYPE = "captureWallet";

    private final String partnerCode;
    private final String accessKey;
    private final String secretKey;
    private final String createUrl;
    private final String redirectUrl;
    private final String ipnUrl;
    private final RestClient restClient = RestClient.create();

    public MomoGatewayClient(
            @Value("${momo.partner-code:MOMO}") String partnerCode,
            @Value("${momo.access-key:F8BBA842ECF85}") String accessKey,
            @Value("${momo.secret-key:K951B6PE1waDMi640xX08PD3vg6EkVlz}") String secretKey,
            @Value("${momo.create-url:https://test-payment.momo.vn/v2/gateway/api/create}") String createUrl,
            @Value("${momo.redirect-url:}") String redirectUrl,
            @Value("${momo.ipn-url:}") String ipnUrl) {
        this.partnerCode = partnerCode;
        this.accessKey = accessKey;
        this.secretKey = secretKey;
        this.createUrl = createUrl;
        this.redirectUrl = redirectUrl;
        this.ipnUrl = ipnUrl;

        if (redirectUrl.isBlank() || ipnUrl.isBlank()) {
            log.warn("MomoGatewayClient đang active (profile khác \"dev\") nhưng MOMO_REDIRECT_URL/MOMO_IPN_URL "
                    + "chưa cấu hình -> Player sẽ KHÔNG thanh toán được. Nếu đang dev/test, chạy lại với "
                    + "-Dspring-boot.run.profiles=dev để dùng MockPaymentGatewayClient (xem CLAUDE.md).");
        }
    }

    @Override
    public String methodName() {
        return "MOMO";
    }

    @Override
    public String buildPaymentUrl(Long bookingId, BigDecimal amount, String orderInfo, String clientIp) {
        String orderId = bookingId.toString();

        String requestId = orderId + "-" + System.currentTimeMillis();
        String amountStr = amount.toBigInteger().toString();
        String extraData = "";

        String rawSignature = "accessKey=" + accessKey
                + "&amount=" + amountStr
                + "&extraData=" + extraData
                + "&ipnUrl=" + ipnUrl
                + "&orderId=" + orderId
                + "&orderInfo=" + orderInfo
                + "&partnerCode=" + partnerCode
                + "&redirectUrl=" + redirectUrl
                + "&requestId=" + requestId
                + "&requestType=" + REQUEST_TYPE;
        String signature = hmacSha256(secretKey, rawSignature);

        Map<String, Object> body = new HashMap<>();
        body.put("partnerCode", partnerCode);
        body.put("partnerName", "Sports Court Booking");
        body.put("storeId", "SportsCourtBookingStore");
        body.put("requestId", requestId);
        body.put("amount", amountStr);
        body.put("orderId", orderId);
        body.put("orderInfo", orderInfo);
        body.put("redirectUrl", redirectUrl);
        body.put("ipnUrl", ipnUrl);
        body.put("lang", "vi");
        body.put("extraData", extraData);
        body.put("requestType", REQUEST_TYPE);
        body.put("signature", signature);

        Map<?, ?> response = restClient.post()
                .uri(createUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(Map.class);

        Object payUrl = response == null ? null : response.get("payUrl");
        if (payUrl == null) {
            throw new IllegalStateException("MoMo không trả về payUrl — response: " + response);
        }
        return payUrl.toString();
    }

    @Override
    public GatewayCallbackResult verifyCallback(Map<String, String> params) {
        String receivedSignature = params.get("signature");

        String rawSignature = "accessKey=" + accessKey
                + "&amount=" + params.getOrDefault("amount", "")
                + "&extraData=" + params.getOrDefault("extraData", "")
                + "&message=" + params.getOrDefault("message", "")
                + "&orderId=" + params.getOrDefault("orderId", "")
                + "&orderInfo=" + params.getOrDefault("orderInfo", "")
                + "&orderType=" + params.getOrDefault("orderType", "")
                + "&partnerCode=" + params.getOrDefault("partnerCode", "")
                + "&payType=" + params.getOrDefault("payType", "")
                + "&requestId=" + params.getOrDefault("requestId", "")
                + "&responseTime=" + params.getOrDefault("responseTime", "")
                + "&resultCode=" + params.getOrDefault("resultCode", "")
                + "&transId=" + params.getOrDefault("transId", "");
        String computedSignature = hmacSha256(secretKey, rawSignature);

        Long bookingId = Long.parseLong(params.get("orderId"));
        String resultCode = params.get("resultCode");
        boolean success = computedSignature.equalsIgnoreCase(receivedSignature) && "0".equals(resultCode);

        return new GatewayCallbackResult(bookingId, success, resultCode);
    }

    private String hmacSha256(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] bytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : bytes) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (Exception e) {
            throw new IllegalStateException("Không tạo được chữ ký MoMo", e);
        }
    }
}

