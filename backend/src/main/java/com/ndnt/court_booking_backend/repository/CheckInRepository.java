package com.ndnt.court_booking_backend.repository;

import com.ndnt.court_booking_backend.entity.CheckIn;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckInRepository extends JpaRepository<CheckIn, Long> {
}

