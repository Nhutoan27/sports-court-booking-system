package com.ndnt.court_booking_backend.repository;

import com.ndnt.court_booking_backend.entity.NoShow;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoShowRepository extends JpaRepository<NoShow, Long> {
}

