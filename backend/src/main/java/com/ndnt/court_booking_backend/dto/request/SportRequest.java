package com.ndnt.court_booking_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SportRequest {

    @NotBlank
    private String name;
}

