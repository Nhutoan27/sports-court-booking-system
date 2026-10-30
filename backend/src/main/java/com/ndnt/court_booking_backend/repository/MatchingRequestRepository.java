package com.ndnt.court_booking_backend.repository;

import com.ndnt.court_booking_backend.common.enums.MatchingRequestStatus;
import com.ndnt.court_booking_backend.entity.MatchingRequest;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchingRequestRepository extends JpaRepository<MatchingRequest, Long> {

    Optional<MatchingRequest> findByUserIdAndSportIdAndStatus(Long userId, Long sportId, MatchingRequestStatus status);

    Page<MatchingRequest> findByUserId(Long userId, Pageable pageable);

    List<MatchingRequest> findBySportIdAndStatusAndUserIdNot(Long sportId, MatchingRequestStatus status, Long userId);
}

