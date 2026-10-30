package com.ndnt.court_booking_backend.controller;

import com.ndnt.court_booking_backend.security.SecurityUtils;
import com.ndnt.court_booking_backend.common.dto.response.ApiResponse;
import com.ndnt.court_booking_backend.dto.request.CreateBookingRequest;
import com.ndnt.court_booking_backend.dto.response.BookingResponse;
import com.ndnt.court_booking_backend.dto.response.NoShowResponse;
import com.ndnt.court_booking_backend.service.BookingService;
import com.ndnt.court_booking_backend.service.NoShowService;
import com.ndnt.court_booking_backend.common.dto.response.PageResponse;
import com.ndnt.court_booking_backend.common.enums.BookingStatus;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.net.URI;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Booking", description = "Đặt sân giữ chỗ 5 phút (BR-02) + thanh toán cọc (BR-01) + huỷ (BR-03/04/05)")
@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final NoShowService noShowService;
    private final String frontendBaseUrl;

    public BookingController(BookingService bookingService, NoShowService noShowService,
                              @Value("${app.frontend-base-url:http://localhost:5173}") String frontendBaseUrl) {
        this.bookingService = bookingService;
        this.noShowService = noShowService;
        this.frontendBaseUrl = frontendBaseUrl;
    }

    @PreAuthorize("hasRole('PLAYER')")
    @PostMapping
    public ApiResponse<BookingResponse> create(@Valid @RequestBody CreateBookingRequest request, HttpServletRequest httpRequest) {
        String clientIp = httpRequest.getRemoteAddr();
        BookingResponse created = bookingService.create(SecurityUtils.currentUserId(), request, clientIp);
        return ApiResponse.ok("Đặt sân thành công, vui lòng thanh toán cọc", created);
    }

    @PreAuthorize("hasRole('PLAYER')")
    @GetMapping("/me")
    public ApiResponse<PageResponse<BookingResponse>> listMine(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ApiResponse.ok(bookingService.listMine(SecurityUtils.currentUserId(), pageable));
    }

    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    @GetMapping
    public ApiResponse<PageResponse<BookingResponse>> listAll(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) LocalDate playDate,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ApiResponse.ok(bookingService.listAll(status, playDate, pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<BookingResponse> getById(@PathVariable Long id, HttpServletRequest httpRequest) {
        boolean privileged = SecurityUtils.currentUserHasAnyRole("STAFF", "ADMIN");
        return ApiResponse.ok(bookingService.getByIdForUser(
                id, SecurityUtils.currentUserId(), privileged, httpRequest.getRemoteAddr()));
    }

    @GetMapping("/availability")
    public ApiResponse<List<Long>> availability(@RequestParam Long courtId,
                                                 @RequestParam LocalDate playDate) {
        return ApiResponse.ok(bookingService.listBookedTimeSlotIds(courtId, playDate));
    }

    @PreAuthorize("hasRole('PLAYER')")
    @PostMapping("/{id}/cancel")
    public ApiResponse<BookingResponse> cancel(@PathVariable Long id) {
        return ApiResponse.ok("Huỷ booking thành công", bookingService.cancel(SecurityUtils.currentUserId(), id));
    }

    @PreAuthorize("hasRole('STAFF')")
    @PostMapping("/{id}/no-show")
    public ApiResponse<NoShowResponse> markNoShow(@PathVariable Long id) {
        NoShowResponse created = noShowService.markNoShow(SecurityUtils.currentUserId(), id);
        return ApiResponse.ok("Đã đánh dấu no-show", created);
    }

    @GetMapping("/momo-return")
    public ResponseEntity<Void> momoReturn(HttpServletRequest request) {
        String bookingId = request.getParameter("orderId");
        if (bookingId == null) {
            bookingId = request.getParameter("bookingId");
        }
        String status;
        try {
            status = bookingService.handlePaymentCallback(toParamMap(request)) ? "success" : "failed";
        } catch (Exception e) {
            status = "error";
        }
        String redirect = frontendBaseUrl + "/player/bookings?paymentStatus=" + status
                + (bookingId != null ? "&bookingId=" + bookingId : "");
        return ResponseEntity.status(302).location(URI.create(redirect)).build();
    }

    @PostMapping("/momo-ipn")
    public ApiResponse<Void> momoIpn(@RequestBody Map<String, Object> body) {
        Map<String, String> params = new HashMap<>();
        body.forEach((key, value) -> params.put(key, value == null ? null : String.valueOf(value)));
        bookingService.handlePaymentCallback(params);
        return ApiResponse.ok(null);
    }

    private Map<String, String> toParamMap(HttpServletRequest request) {
        Map<String, String> params = new HashMap<>();
        request.getParameterMap().forEach((key, values) -> {
            if (values != null && values.length > 0) {
                params.put(key, values[0]);
            }
        });
        return params;
    }
}

