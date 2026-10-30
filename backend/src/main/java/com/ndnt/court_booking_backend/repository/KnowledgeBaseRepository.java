package com.ndnt.court_booking_backend.repository;

import com.ndnt.court_booking_backend.entity.KnowledgeBase;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KnowledgeBaseRepository extends JpaRepository<KnowledgeBase, Long> {
}

