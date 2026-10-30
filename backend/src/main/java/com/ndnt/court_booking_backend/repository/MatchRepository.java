package com.ndnt.court_booking_backend.repository;

import com.ndnt.court_booking_backend.entity.Match;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchRepository extends JpaRepository<Match, Long> {

    Page<Match> findByUser1IdOrUser2Id(Long user1Id, Long user2Id, Pageable pageable);
}

