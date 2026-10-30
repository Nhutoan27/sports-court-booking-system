package com.ndnt.court_booking_backend.service.impl;

import com.ndnt.court_booking_backend.entity.Booking;
import com.ndnt.court_booking_backend.entity.Cancellation;
import com.ndnt.court_booking_backend.repository.CancellationRepository;
import com.ndnt.court_booking_backend.service.CancellationService;
import com.ndnt.court_booking_backend.common.enums.RefundStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CancellationServiceImpl implements CancellationService {

    private final CancellationRepository cancellationRepository;

    public CancellationServiceImpl(CancellationRepository cancellationRepository) {
        this.cancellationRepository = cancellationRepository;
    }

    @Override
    @Transactional
    public Cancellation record(Booking booking, RefundStatus refundStatus) {
        Cancellation cancellation = new Cancellation();
        cancellation.setBooking(booking);
        cancellation.setRefundStatus(refundStatus);
        return cancellationRepository.save(cancellation);
    }
}

