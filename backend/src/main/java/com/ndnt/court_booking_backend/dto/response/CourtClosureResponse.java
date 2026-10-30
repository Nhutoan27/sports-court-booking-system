package com.ndnt.court_booking_backend.dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CourtClosureResponse {
    private Long id;
    private Long courtId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}

