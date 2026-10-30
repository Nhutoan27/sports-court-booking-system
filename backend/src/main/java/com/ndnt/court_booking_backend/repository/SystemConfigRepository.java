package com.ndnt.court_booking_backend.repository;

import com.ndnt.court_booking_backend.entity.SystemConfig;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SystemConfigRepository extends JpaRepository<SystemConfig, Long> {

    List<SystemConfig> findAllByOrderByEffectiveFromDesc();

    Optional<SystemConfig> findFirstByEffectiveFromLessThanEqualOrderByEffectiveFromDesc(LocalDateTime now);
}

