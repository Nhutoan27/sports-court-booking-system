package com.ndnt.court_booking_backend.repository;

import com.ndnt.court_booking_backend.entity.Booking;
import com.ndnt.court_booking_backend.common.enums.BookingStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    Page<Booking> findByUserId(Long userId, Pageable pageable);

    Page<Booking> findByStatus(BookingStatus status, Pageable pageable);

    Page<Booking> findByPlayDate(LocalDate playDate, Pageable pageable);

    Page<Booking> findByStatusAndPlayDate(BookingStatus status, LocalDate playDate, Pageable pageable);

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByStatusAndCreatedAtBefore(BookingStatus status, LocalDateTime threshold);

    @Query("SELECT b.status, COUNT(b) FROM Booking b WHERE b.playDate BETWEEN :from AND :to GROUP BY b.status")
    List<Object[]> countByStatusBetween(@Param("from") LocalDate from, @Param("to") LocalDate to);

    @Query("SELECT b.court.sport.name, COUNT(b) FROM Booking b "
            + "WHERE b.playDate BETWEEN :from AND :to GROUP BY b.court.sport.name")
    List<Object[]> countBySportBetween(@Param("from") LocalDate from, @Param("to") LocalDate to);

    List<Booking> findTop10ByOrderByCreatedAtDesc();
}

