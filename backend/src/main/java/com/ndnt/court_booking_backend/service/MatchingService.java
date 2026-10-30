package com.ndnt.court_booking_backend.service;

import com.ndnt.court_booking_backend.common.dto.response.PageResponse;
import com.ndnt.court_booking_backend.dto.request.MatchingRequestCreateRequest;
import com.ndnt.court_booking_backend.dto.request.SendInvitationRequest;
import com.ndnt.court_booking_backend.dto.response.MatchCandidateResponse;
import com.ndnt.court_booking_backend.dto.response.MatchResponse;
import com.ndnt.court_booking_backend.dto.response.MatchingInvitationResponse;
import com.ndnt.court_booking_backend.dto.response.MatchingRequestResponse;
import com.ndnt.court_booking_backend.entity.MatchingRequest;
import java.util.List;
import org.springframework.data.domain.Pageable;

public interface MatchingService {

    MatchingRequestResponse createRequest(Long userId, MatchingRequestCreateRequest dto);

    PageResponse<MatchingRequestResponse> listMine(Long userId, Pageable pageable);

    void cancelRequest(Long userId, Long requestId);

    List<MatchCandidateResponse> findCandidates(Long userId, Long requestId);

    MatchingInvitationResponse sendInvitation(Long senderId, SendInvitationRequest dto);

    PageResponse<MatchingInvitationResponse> listReceivedInvitations(Long userId, Pageable pageable);

    PageResponse<MatchingInvitationResponse> listSentInvitations(Long userId, Pageable pageable);

    MatchingInvitationResponse respondInvitation(Long receiverId, Long invitationId, boolean accept);

    MatchingInvitationResponse cancelInvitation(Long senderId, Long invitationId);

    PageResponse<MatchResponse> listMyMatches(Long userId, Pageable pageable);

    List<MatchCandidateResponse> findCandidatesForUserAndSport(Long userId, Long sportId);

    MatchingRequest getEntityById(Long id);
}

