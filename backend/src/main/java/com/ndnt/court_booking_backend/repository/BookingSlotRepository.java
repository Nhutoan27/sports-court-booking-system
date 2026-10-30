package com.ndnt.court_booking_backend.repository;

import com.ndnt.court_booking_backend.entity.BookingSlot;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingSlotRepository extends JpaRepository<BookingSlot, Long> {

    List<BookingSlot> findByCourtIdAndPlayDate(Long courtId, LocalDate playDate);
}

