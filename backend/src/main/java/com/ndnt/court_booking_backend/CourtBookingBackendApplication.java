package com.ndnt.court_booking_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class CourtBookingBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CourtBookingBackendApplication.class, args);
	}

}

