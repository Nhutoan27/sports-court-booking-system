package com.ndnt.court_booking_backend.repository;

import com.ndnt.court_booking_backend.common.enums.MatchingInvitationStatus;
import com.ndnt.court_booking_backend.entity.MatchingInvitation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchingInvitationRepository extends JpaRepository<MatchingInvitation, Long> {

    Page<MatchingInvitation> findByReceiverId(Long receiverId, Pageable pageable);

    Page<MatchingInvitation> findBySenderId(Long senderId, Pageable pageable);

    boolean existsBySenderIdAndReceiverIdAndMatchingRequestIdAndStatus(
            Long senderId, Long receiverId, Long matchingRequestId, MatchingInvitationStatus status);

    boolean existsBySenderIdAndReceiverIdAndMatchingRequest_Sport_IdAndStatus(
            Long senderId, Long receiverId, Long sportId, MatchingInvitationStatus status);
}

