package com.ndnt.court_booking_backend.controller;

import com.ndnt.court_booking_backend.common.dto.response.ApiResponse;
import com.ndnt.court_booking_backend.dto.request.CourtClosureRequest;
import com.ndnt.court_booking_backend.dto.request.CourtPriceRequest;
import com.ndnt.court_booking_backend.dto.request.CourtRequest;
import com.ndnt.court_booking_backend.dto.request.StatusRequest;
import com.ndnt.court_booking_backend.dto.response.CourtClosureResponse;
import com.ndnt.court_booking_backend.dto.response.CourtPriceResponse;
import com.ndnt.court_booking_backend.dto.response.CourtResponse;
import com.ndnt.court_booking_backend.service.CourtClosureService;
import com.ndnt.court_booking_backend.service.CourtPriceService;
import com.ndnt.court_booking_backend.service.CourtService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Court", description = "Sân + bảng giá (CourtPrice) + lịch đóng sân (CourtClosure) — đọc công khai, sửa chỉ Admin")
@RestController
@RequestMapping("/courts")
public class CourtController {

    private final CourtService courtService;
    private final CourtPriceService courtPriceService;
    private final CourtClosureService courtClosureService;

    public CourtController(CourtService courtService, CourtPriceService courtPriceService,
                            CourtClosureService courtClosureService) {
        this.courtService = courtService;
        this.courtPriceService = courtPriceService;
        this.courtClosureService = courtClosureService;
    }

    @GetMapping
    public ApiResponse<List<CourtResponse>> listAll(@RequestParam(required = false) Long sportId) {
        return ApiResponse.ok(courtService.listAll(sportId));
    }

    @GetMapping("/{id}")
    public ApiResponse<CourtResponse> getById(@PathVariable Long id) {
        return ApiResponse.ok(courtService.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ApiResponse<CourtResponse> create(@Valid @RequestBody CourtRequest request) {
        return ApiResponse.ok("Tạo sân thành công", courtService.create(request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}")
    public ApiResponse<CourtResponse> update(@PathVariable Long id, @Valid @RequestBody CourtRequest request) {
        return ApiResponse.ok(courtService.update(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/status")
    public ApiResponse<CourtResponse> updateStatus(@PathVariable Long id, @Valid @RequestBody StatusRequest request) {
        return ApiResponse.ok(courtService.updateStatus(id, request));
    }

    @GetMapping("/{courtId}/prices")
    public ApiResponse<List<CourtPriceResponse>> listPrices(@PathVariable Long courtId) {
        return ApiResponse.ok(courtPriceService.listByCourt(courtId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{courtId}/prices")
    public ApiResponse<CourtPriceResponse> createPrice(@PathVariable Long courtId, @Valid @RequestBody CourtPriceRequest request) {
        return ApiResponse.ok("Thêm mức giá thành công", courtPriceService.create(courtId, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/prices/{priceId}")
    public ApiResponse<Void> deletePrice(@PathVariable Long priceId) {
        courtPriceService.delete(priceId);
        return ApiResponse.ok("Xoá mức giá thành công", null);
    }

    @GetMapping("/{courtId}/closures")
    public ApiResponse<List<CourtClosureResponse>> listClosures(@PathVariable Long courtId) {
        return ApiResponse.ok(courtClosureService.listByCourt(courtId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{courtId}/closures")
    public ApiResponse<CourtClosureResponse> createClosure(@PathVariable Long courtId, @Valid @RequestBody CourtClosureRequest request) {
        return ApiResponse.ok("Tạo lịch đóng sân thành công", courtClosureService.create(courtId, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/closures/{closureId}")
    public ApiResponse<Void> deleteClosure(@PathVariable Long closureId) {
        courtClosureService.delete(closureId);
        return ApiResponse.ok("Huỷ lịch đóng sân thành công", null);
    }
}

