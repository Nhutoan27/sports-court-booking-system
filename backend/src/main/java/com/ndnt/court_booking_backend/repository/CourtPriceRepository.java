package com.ndnt.court_booking_backend.repository;

import com.ndnt.court_booking_backend.entity.CourtPrice;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourtPriceRepository extends JpaRepository<CourtPrice, Long> {

    List<CourtPrice> findByCourtId(Long courtId);
}

