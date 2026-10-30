package com.ndnt.court_booking_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourtRequest {

    @NotNull
    private Long sportId;

    @NotBlank
    private String name;
}

