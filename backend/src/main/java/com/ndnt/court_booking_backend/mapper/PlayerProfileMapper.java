package com.ndnt.court_booking_backend.mapper;

import com.ndnt.court_booking_backend.dto.response.PlayerProfileResponse;
import com.ndnt.court_booking_backend.entity.PlayerProfile;

public final class PlayerProfileMapper {

    private PlayerProfileMapper() {
    }

    public static PlayerProfileResponse toResponse(PlayerProfile profile) {
        return new PlayerProfileResponse(
                profile.getId(), profile.getUser().getId(), profile.getFavoriteSport(),
                profile.getYearsExperience(), profile.getSkillLevel(), profile.getFreeTimeVector());
    }
}

