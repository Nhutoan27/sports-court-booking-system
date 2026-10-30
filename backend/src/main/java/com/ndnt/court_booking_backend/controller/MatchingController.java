package com.ndnt.court_booking_backend.controller;

import com.ndnt.court_booking_backend.security.SecurityUtils;
import com.ndnt.court_booking_backend.common.dto.response.ApiResponse;
import com.ndnt.court_booking_backend.common.dto.response.PageResponse;
import com.ndnt.court_booking_backend.dto.request.MatchingRequestCreateRequest;
import com.ndnt.court_booking_backend.dto.request.SendInvitationRequest;
import com.ndnt.court_booking_backend.dto.response.MatchCandidateResponse;
import com.ndnt.court_booking_backend.dto.response.MatchResponse;
import com.ndnt.court_booking_backend.dto.response.MatchingInvitationResponse;
import com.ndnt.court_booking_backend.dto.response.MatchingRequestResponse;
import com.ndnt.court_booking_backend.service.MatchingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Matching", description = "Ghép cặp chơi cùng — UC-10, chỉ Player (BR-10)")
@PreAuthorize("hasRole('PLAYER')")
@RestController
@RequestMapping("/matching")
public class MatchingController {

    private final MatchingService matchingService;

    public MatchingController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    @PostMapping("/requests")
    public ApiResponse<MatchingRequestResponse> createRequest(@Valid @RequestBody MatchingRequestCreateRequest request) {
        MatchingRequestResponse created = matchingService.createRequest(SecurityUtils.currentUserId(), request);
        return ApiResponse.ok("Tạo yêu cầu ghép cặp thành công", created);
    }

    @GetMapping("/requests/me")
    public ApiResponse<PageResponse<MatchingRequestResponse>> listMyRequests(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ApiResponse.ok(matchingService.listMine(SecurityUtils.currentUserId(), pageable));
    }

    @PatchMapping("/requests/{id}/cancel")
    public ApiResponse<Void> cancelRequest(@PathVariable Long id) {
        matchingService.cancelRequest(SecurityUtils.currentUserId(), id);
        return ApiResponse.ok("Huỷ yêu cầu ghép cặp thành công", null);
    }

    @GetMapping("/requests/{id}/candidates")
    public ApiResponse<List<MatchCandidateResponse>> findCandidates(@PathVariable Long id) {
        return ApiResponse.ok(matchingService.findCandidates(SecurityUtils.currentUserId(), id));
    }

    @PostMapping("/invitations")
    public ApiResponse<MatchingInvitationResponse> sendInvitation(@Valid @RequestBody SendInvitationRequest request) {
        MatchingInvitationResponse created = matchingService.sendInvitation(SecurityUtils.currentUserId(), request);
        return ApiResponse.ok("Gửi lời mời thành công", created);
    }

    @GetMapping("/invitations/received")
    public ApiResponse<PageResponse<MatchingInvitationResponse>> receivedInvitations(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ApiResponse.ok(matchingService.listReceivedInvitations(SecurityUtils.currentUserId(), pageable));
    }

    @GetMapping("/invitations/sent")
    public ApiResponse<PageResponse<MatchingInvitationResponse>> sentInvitations(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ApiResponse.ok(matchingService.listSentInvitations(SecurityUtils.currentUserId(), pageable));
    }

    @PatchMapping("/invitations/{id}/accept")
    public ApiResponse<MatchingInvitationResponse> acceptInvitation(@PathVariable Long id) {
        return ApiResponse.ok(matchingService.respondInvitation(SecurityUtils.currentUserId(), id, true));
    }

    @PatchMapping("/invitations/{id}/reject")
    public ApiResponse<MatchingInvitationResponse> rejectInvitation(@PathVariable Long id) {
        return ApiResponse.ok(matchingService.respondInvitation(SecurityUtils.currentUserId(), id, false));
    }

    @PatchMapping("/invitations/{id}/cancel")
    public ApiResponse<MatchingInvitationResponse> cancelInvitation(@PathVariable Long id) {
        return ApiResponse.ok("Huỷ lời mời thành công", matchingService.cancelInvitation(SecurityUtils.currentUserId(), id));
    }

    @GetMapping("/matches/me")
    public ApiResponse<PageResponse<MatchResponse>> myMatches(
            @PageableDefault(size = 20, sort = "matchedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ApiResponse.ok(matchingService.listMyMatches(SecurityUtils.currentUserId(), pageable));
    }
}

