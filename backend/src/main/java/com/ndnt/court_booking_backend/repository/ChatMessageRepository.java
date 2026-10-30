package com.ndnt.court_booking_backend.repository;

import com.ndnt.court_booking_backend.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    Page<ChatMessage> findByChatSessionId(Long chatSessionId, Pageable pageable);
}

