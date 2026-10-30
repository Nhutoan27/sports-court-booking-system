package com.ndnt.court_booking_backend.service.impl;

import com.ndnt.court_booking_backend.common.util.VectorMathUtil;
import com.ndnt.court_booking_backend.entity.MatchingRequest;
import com.ndnt.court_booking_backend.service.CosineSimilarityCalculator;
import org.springframework.stereotype.Service;

@Service
public class CosineSimilarityCalculatorImpl implements CosineSimilarityCalculator {

    private static final int FREE_TIME_SLOTS = 21;
    private static final float MAX_AGE = 100f;
    private static final float MAX_EXPERIENCE_YEARS = 30f;

    @Override
    public double similarity(MatchingRequest a, MatchingRequest b) {
        return VectorMathUtil.cosineSimilarity(encode(a), encode(b));
    }

    @Override
    public float[] encode(MatchingRequest request) {
        float[] vector = new float[3 + FREE_TIME_SLOTS];
        vector[0] = clamp01(request.getAge() / MAX_AGE);
        vector[1] = clamp01(request.getExperience() / MAX_EXPERIENCE_YEARS);
        vector[2] = skillScore(request.getSkillLevel());

        float[] freeTime = parseFreeTimeVector(request.getFreeTimeVector());
        System.arraycopy(freeTime, 0, vector, 3, FREE_TIME_SLOTS);
        return vector;
    }

    private float[] parseFreeTimeVector(String raw) {
        float[] result = new float[FREE_TIME_SLOTS];
        if (raw == null || raw.isBlank()) {
            return result;
        }
        String[] parts = raw.split(",");
        if (parts.length != FREE_TIME_SLOTS) {
            return result;
        }
        for (int i = 0; i < FREE_TIME_SLOTS; i++) {
            try {
                result[i] = Float.parseFloat(parts[i].trim()) > 0 ? 1f : 0f;
            } catch (NumberFormatException e) {
                result[i] = 0f;
            }
        }
        return result;
    }

    private float skillScore(String skillLevel) {
        if (skillLevel == null) {
            return 0.5f;
        }
        String normalized = skillLevel.trim().toUpperCase();
        switch (normalized) {
            case "BEGINNER":
            case "MOI_BAT_DAU":
                return 0.33f;
            case "INTERMEDIATE":
            case "TRUNG_BINH":
                return 0.66f;
            case "ADVANCED":
            case "NANG_CAO":
                return 1.0f;
            default:
                return 0.5f;
        }
    }

    private float clamp01(float value) {
        return Math.max(0f, Math.min(1f, value));
    }
}

