package com.ndnt.court_booking_backend.entity;

import com.ndnt.court_booking_backend.common.entity.BaseEntity;
import com.ndnt.court_booking_backend.common.enums.MatchingRequestStatus;
import com.ndnt.court_booking_backend.entity.Sport;
import com.ndnt.court_booking_backend.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class MatchingRequest extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sport_id", nullable = false)
    private Sport sport;

    private float age;

    private float experience;

    private String skillLevel;

    @Column(columnDefinition = "TEXT")
    private String freeTimeVector;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MatchingRequestStatus status;
}

