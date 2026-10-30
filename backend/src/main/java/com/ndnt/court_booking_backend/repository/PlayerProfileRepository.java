package com.ndnt.court_booking_backend.repository;

import com.ndnt.court_booking_backend.entity.PlayerProfile;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayerProfileRepository extends JpaRepository<PlayerProfile, Long> {

    Optional<PlayerProfile> findByUserId(Long userId);
}

