package com.ndnt.court_booking_backend.repository;

import com.ndnt.court_booking_backend.entity.Cancellation;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CancellationRepository extends JpaRepository<Cancellation, Long> {

    Optional<Cancellation> findByBookingId(Long bookingId);
}

