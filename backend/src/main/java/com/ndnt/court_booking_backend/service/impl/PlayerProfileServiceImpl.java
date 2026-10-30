package com.ndnt.court_booking_backend.service.impl;

import com.ndnt.court_booking_backend.dto.request.PlayerProfileRequest;
import com.ndnt.court_booking_backend.dto.response.PlayerProfileResponse;
import com.ndnt.court_booking_backend.entity.PlayerProfile;
import com.ndnt.court_booking_backend.mapper.PlayerProfileMapper;
import com.ndnt.court_booking_backend.repository.PlayerProfileRepository;
import com.ndnt.court_booking_backend.service.PlayerProfileService;
import com.ndnt.court_booking_backend.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PlayerProfileServiceImpl implements PlayerProfileService {

    private final PlayerProfileRepository playerProfileRepository;
    private final UserService userService;

    public PlayerProfileServiceImpl(PlayerProfileRepository playerProfileRepository, UserService userService) {
        this.playerProfileRepository = playerProfileRepository;
        this.userService = userService;
    }

    @Override
    public PlayerProfileResponse getMine(Long userId) {
        PlayerProfile profile = playerProfileRepository.findByUserId(userId).orElse(null);
        if (profile == null) {
            return null;
        }
        return PlayerProfileMapper.toResponse(profile);
    }

    @Override
    @Transactional
    public PlayerProfileResponse upsert(Long userId, PlayerProfileRequest request) {
        PlayerProfile profile = playerProfileRepository.findByUserId(userId).orElse(null);
        if (profile == null) {
            profile = new PlayerProfile();
            profile.setUser(userService.getEntityById(userId));
        }
        profile.setFavoriteSport(request.getFavoriteSport());
        profile.setYearsExperience(request.getYearsExperience());
        profile.setSkillLevel(request.getSkillLevel());
        profile.setFreeTimeVector(request.getFreeTimeVector());
        return PlayerProfileMapper.toResponse(playerProfileRepository.save(profile));
    }
}

