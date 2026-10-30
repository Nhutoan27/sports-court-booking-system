package com.ndnt.court_booking_backend.repository;

import com.ndnt.court_booking_backend.entity.TimeSlot;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {

    List<TimeSlot> findByCourtIdOrderByStartTime(Long courtId);
}

