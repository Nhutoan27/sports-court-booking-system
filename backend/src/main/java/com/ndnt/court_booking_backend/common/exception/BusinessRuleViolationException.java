package com.ndnt.court_booking_backend.common.exception;

import org.springframework.http.HttpStatus;

public class BusinessRuleViolationException extends ApiException {

    public BusinessRuleViolationException(String message) {
        super(HttpStatus.CONFLICT, message);
    }
}

