package com.ndnt.court_booking_backend.dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CheckInResponse {
    private Long id;
    private Long bookingId;
    private Long staffId;
    private LocalDateTime checkedInAt;
}

