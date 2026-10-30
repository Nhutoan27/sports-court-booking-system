package com.ndnt.court_booking_backend.entity;

import com.ndnt.court_booking_backend.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Sport extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;

    private String status;
}

