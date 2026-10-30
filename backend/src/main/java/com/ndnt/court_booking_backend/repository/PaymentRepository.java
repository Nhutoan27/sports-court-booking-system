package com.ndnt.court_booking_backend.repository;

import com.ndnt.court_booking_backend.entity.Payment;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByBookingId(Long bookingId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p "
            + "WHERE p.status = com.ndnt.court_booking_backend.common.enums.PaymentStatus.SUCCESS "
            + "AND p.createdAt >= :from AND p.createdAt < :to")
    BigDecimal sumSuccessAmountBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("SELECT FUNCTION('DATE', p.createdAt), COALESCE(SUM(p.amount), 0) FROM Payment p "
            + "WHERE p.status = com.ndnt.court_booking_backend.common.enums.PaymentStatus.SUCCESS "
            + "AND p.createdAt >= :from AND p.createdAt < :to "
            + "GROUP BY FUNCTION('DATE', p.createdAt) ORDER BY FUNCTION('DATE', p.createdAt)")
    List<Object[]> sumSuccessAmountGroupByDay(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}

