package com.ndnt.court_booking_backend.mapper;

import com.ndnt.court_booking_backend.dto.response.CourtClosureResponse;
import com.ndnt.court_booking_backend.dto.response.CourtPriceResponse;
import com.ndnt.court_booking_backend.dto.response.CourtResponse;
import com.ndnt.court_booking_backend.dto.response.SportResponse;
import com.ndnt.court_booking_backend.entity.Court;
import com.ndnt.court_booking_backend.entity.CourtClosure;
import com.ndnt.court_booking_backend.entity.CourtPrice;
import com.ndnt.court_booking_backend.entity.Sport;

public final class CourtMapper {

    private CourtMapper() {
    }

    public static SportResponse toResponse(Sport sport) {
        return new SportResponse(sport.getId(), sport.getName(), sport.getStatus());
    }

    public static CourtResponse toResponse(Court court) {
        return new CourtResponse(
                court.getId(), court.getSport().getId(), court.getSport().getName(),
                court.getName(), court.getStatus());
    }

    public static CourtPriceResponse toResponse(CourtPrice price) {
        return new CourtPriceResponse(
                price.getId(), price.getCourt().getId(), price.getRangeStart(), price.getRangeEnd(), price.getPrice());
    }

    public static CourtClosureResponse toResponse(CourtClosure closure) {
        return new CourtClosureResponse(
                closure.getId(), closure.getCourt().getId(), closure.getStartTime(), closure.getEndTime());
    }
}

