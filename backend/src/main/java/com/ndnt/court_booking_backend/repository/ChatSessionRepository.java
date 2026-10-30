package com.ndnt.court_booking_backend.repository;

import com.ndnt.court_booking_backend.entity.ChatSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {

    Page<ChatSession> findByUserId(Long userId, Pageable pageable);
}

