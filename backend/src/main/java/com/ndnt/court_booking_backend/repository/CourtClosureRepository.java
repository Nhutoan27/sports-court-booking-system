package com.ndnt.court_booking_backend.repository;

import com.ndnt.court_booking_backend.entity.CourtClosure;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourtClosureRepository extends JpaRepository<CourtClosure, Long> {

    List<CourtClosure> findByCourtId(Long courtId);
}

