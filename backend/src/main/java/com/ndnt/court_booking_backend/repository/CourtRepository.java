package com.ndnt.court_booking_backend.repository;

import com.ndnt.court_booking_backend.entity.Court;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourtRepository extends JpaRepository<Court, Long> {

    List<Court> findBySportId(Long sportId);
}

