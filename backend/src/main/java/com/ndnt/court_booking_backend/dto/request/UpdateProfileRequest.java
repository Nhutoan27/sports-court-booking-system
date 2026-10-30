package com.ndnt.court_booking_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {

    @NotBlank
    private String fullName;

    private String phone;
    private LocalDate dob;
    private String gender;
}

