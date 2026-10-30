package com.ndnt.court_booking_backend.repository;

import com.ndnt.court_booking_backend.entity.Sport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SportRepository extends JpaRepository<Sport, Long> {
}

