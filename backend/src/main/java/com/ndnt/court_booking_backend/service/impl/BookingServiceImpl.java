package com.ndnt.court_booking_backend.service.impl;

import com.ndnt.court_booking_backend.dto.request.CreateBookingRequest;
import com.ndnt.court_booking_backend.dto.response.BookingResponse;
import com.ndnt.court_booking_backend.entity.Booking;
import com.ndnt.court_booking_backend.entity.BookingSlot;
import com.ndnt.court_booking_backend.entity.Cancellation;
import com.ndnt.court_booking_backend.mapper.BookingMapper;
import com.ndnt.court_booking_backend.repository.BookingRepository;
import com.ndnt.court_booking_backend.repository.BookingSlotRepository;
import com.ndnt.court_booking_backend.service.BookingService;
import com.ndnt.court_booking_backend.service.CancellationService;
import com.ndnt.court_booking_backend.repository.CancellationRepository;
import com.ndnt.court_booking_backend.common.dto.response.PageResponse;
import com.ndnt.court_booking_backend.common.enums.BookingStatus;
import com.ndnt.court_booking_backend.common.enums.PaymentStatus;
import com.ndnt.court_booking_backend.common.enums.RefundStatus;
import com.ndnt.court_booking_backend.common.exception.BusinessRuleViolationException;
import com.ndnt.court_booking_backend.common.exception.ForbiddenException;
import com.ndnt.court_booking_backend.common.exception.ResourceNotFoundException;
import com.ndnt.court_booking_backend.entity.Court;
import com.ndnt.court_booking_backend.entity.CourtPrice;
import com.ndnt.court_booking_backend.entity.TimeSlot;
import com.ndnt.court_booking_backend.repository.CourtPriceRepository;
import com.ndnt.court_booking_backend.service.CourtService;
import com.ndnt.court_booking_backend.service.TimeSlotService;
import com.ndnt.court_booking_backend.entity.Payment;
import com.ndnt.court_booking_backend.repository.PaymentRepository;
import com.ndnt.court_booking_backend.service.GatewayCallbackResult;
import com.ndnt.court_booking_backend.service.PaymentGatewayClient;
import com.ndnt.court_booking_backend.entity.SystemConfig;
import com.ndnt.court_booking_backend.service.SystemConfigService;
import com.ndnt.court_booking_backend.entity.User;
import com.ndnt.court_booking_backend.service.UserService;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingServiceImpl implements BookingService {

    private static final int MAX_CONSECUTIVE_SLOTS = 3;

    private final BookingRepository bookingRepository;
    private final BookingSlotRepository bookingSlotRepository;
    private final PaymentRepository paymentRepository;
    private final CourtPriceRepository courtPriceRepository;
    private final CourtService courtService;
    private final TimeSlotService timeSlotService;
    private final UserService userService;
    private final SystemConfigService systemConfigService;
    private final PaymentGatewayClient paymentGatewayClient;
    private final CancellationService cancellationService;
    private final CancellationRepository cancellationRepository;

    public BookingServiceImpl(BookingRepository bookingRepository, BookingSlotRepository bookingSlotRepository,
                               PaymentRepository paymentRepository, CourtPriceRepository courtPriceRepository,
                               CourtService courtService, TimeSlotService timeSlotService, UserService userService,
                               SystemConfigService systemConfigService, PaymentGatewayClient paymentGatewayClient,
                               CancellationService cancellationService, CancellationRepository cancellationRepository) {
        this.bookingRepository = bookingRepository;
        this.bookingSlotRepository = bookingSlotRepository;
        this.paymentRepository = paymentRepository;
        this.courtPriceRepository = courtPriceRepository;
        this.courtService = courtService;
        this.timeSlotService = timeSlotService;
        this.userService = userService;
        this.systemConfigService = systemConfigService;
        this.paymentGatewayClient = paymentGatewayClient;
        this.cancellationService = cancellationService;
        this.cancellationRepository = cancellationRepository;
    }

    @Override
    public Booking getEntityById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy booking"));
    }

    @Override
    public BookingResponse getByIdForUser(Long id, Long requesterId, boolean privileged, String clientIp) {
        Booking booking = getEntityById(id);
        if (!privileged && !booking.getUser().getId().equals(requesterId)) {
            throw new ForbiddenException("Không phải booking của bạn");
        }
        return BookingMapper.toResponse(booking, currentPaymentStatus(booking.getId()),
                rebuildPaymentUrlIfPending(booking, clientIp), currentRefundStatus(booking.getId()));
    }

    @Override
    public List<Long> listBookedTimeSlotIds(Long courtId, LocalDate playDate) {
        List<Long> bookedTimeSlotIds = new ArrayList<>();
        for (BookingSlot bs : bookingSlotRepository.findByCourtIdAndPlayDate(courtId, playDate)) {
            bookedTimeSlotIds.add(bs.getTimeSlot().getId());
        }
        return bookedTimeSlotIds;
    }

    private String rebuildPaymentUrlIfPending(Booking booking, String clientIp) {
        if (booking.getStatus() != BookingStatus.PENDING) {
            return null;
        }
        return paymentRepository.findByBookingId(booking.getId())
                .map(payment -> paymentGatewayClient.buildPaymentUrl(
                        booking.getId(), payment.getAmount(), "Dat coc booking " + booking.getId(), clientIp))
                .orElse(null);
    }

    @Override
    public PageResponse<BookingResponse> listMine(Long userId, Pageable pageable) {
        Page<Booking> bookings = bookingRepository.findByUserId(userId, pageable);
        return PageResponse.from(bookings.map(
                b -> BookingMapper.toResponse(b, currentPaymentStatus(b.getId()), null, currentRefundStatus(b.getId()))));
    }

    @Override
    public PageResponse<BookingResponse> listAll(BookingStatus status, LocalDate playDate, Pageable pageable) {
        Page<Booking> bookings;
        if (status != null && playDate != null) {
            bookings = bookingRepository.findByStatusAndPlayDate(status, playDate, pageable);
        } else if (playDate != null) {
            bookings = bookingRepository.findByPlayDate(playDate, pageable);
        } else if (status != null) {
            bookings = bookingRepository.findByStatus(status, pageable);
        } else {
            bookings = bookingRepository.findAll(pageable);
        }
        return PageResponse.from(bookings.map(
                b -> BookingMapper.toResponse(b, currentPaymentStatus(b.getId()), null, currentRefundStatus(b.getId()))));
    }

    @Override
    @Transactional
    public BookingResponse create(Long userId, CreateBookingRequest request, String clientIp) {
        User user = userService.getEntityById(userId);
        Court court = courtService.getEntityById(request.getCourtId());
        if (!"ACTIVE".equalsIgnoreCase(court.getStatus())) {
            throw new BusinessRuleViolationException("Sân hiện không khả dụng để đặt");
        }

        List<TimeSlot> slots = new ArrayList<>();
        for (Long timeSlotId : request.getTimeSlotIds()) {
            slots.add(timeSlotService.getEntityById(timeSlotId));
        }
        slots.sort((a, b) -> a.getStartTime().compareTo(b.getStartTime()));
        for (TimeSlot slot : slots) {
            if (!slot.getCourt().getId().equals(court.getId())) {
                throw new BusinessRuleViolationException("Khung giờ không thuộc sân đã chọn");
            }
        }
        validateMaxConsecutiveSlots(slots);

        List<BookingSlot> existingSlots = bookingSlotRepository.findByCourtIdAndPlayDate(court.getId(), request.getPlayDate());
        Set<Long> taken = new HashSet<>();
        for (BookingSlot bs : existingSlots) {
            taken.add(bs.getTimeSlot().getId());
        }
        for (Long timeSlotId : request.getTimeSlotIds()) {
            if (taken.contains(timeSlotId)) {
                throw new BusinessRuleViolationException("Một số khung giờ đã được đặt, vui lòng chọn lại");
            }
        }

        BigDecimal totalPrice = BigDecimal.ZERO;
        for (TimeSlot slot : slots) {
            totalPrice = totalPrice.add(priceForSlot(court, slot));
        }

        SystemConfig config = systemConfigService.getCurrentEffective();
        BigDecimal depositAmount = totalPrice
                .multiply(config.getDepositPercentage())
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setCourt(court);
        booking.setPlayDate(request.getPlayDate());
        booking.setTotalPrice(totalPrice);
        booking.setDepositAmount(depositAmount);
        booking.setStatus(BookingStatus.PENDING);

        for (TimeSlot slot : slots) {
            BookingSlot bookingSlot = new BookingSlot();
            bookingSlot.setBooking(booking);
            bookingSlot.setTimeSlot(slot);
            bookingSlot.setCourtId(court.getId());
            bookingSlot.setPlayDate(request.getPlayDate());
            booking.getBookingSlots().add(bookingSlot);
        }

        booking = bookingRepository.saveAndFlush(booking);

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(depositAmount);
        payment.setMethod(paymentGatewayClient.methodName());
        payment.setStatus(PaymentStatus.PENDING);
        paymentRepository.save(payment);

        String orderInfo = "Dat coc booking " + booking.getId();
        String paymentUrl = paymentGatewayClient.buildPaymentUrl(booking.getId(), depositAmount, orderInfo, clientIp);

        return BookingMapper.toResponse(booking, payment.getStatus(), paymentUrl, null);
    }

    @Override
    @Transactional
    public BookingResponse cancel(Long userId, Long bookingId) {
        Booking booking = getEntityById(bookingId);
        if (!booking.getUser().getId().equals(userId)) {
            throw new ForbiddenException("Không phải booking của bạn");
        }
        if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new BusinessRuleViolationException("Không thể huỷ booking ở trạng thái hiện tại");
        }

        LocalDateTime earliestPlayTime = null;
        for (BookingSlot bs : booking.getBookingSlots()) {
            LocalDateTime startTime = booking.getPlayDate().atTime(bs.getTimeSlot().getStartTime());
            if (earliestPlayTime == null || startTime.isBefore(earliestPlayTime)) {
                earliestPlayTime = startTime;
            }
        }
        if (earliestPlayTime == null) {
            throw new BusinessRuleViolationException("Booking không có khung giờ nào");
        }

        SystemConfig config = systemConfigService.getCurrentEffective();
        LocalDateTime cutoff = earliestPlayTime.minusHours(config.getCancelHours());
        RefundStatus refundStatus = LocalDateTime.now().isBefore(cutoff) ? RefundStatus.DA_HOAN_COC : RefundStatus.KHONG_HOAN_COC;

        cancellationService.record(booking, refundStatus);

        paymentRepository.findByBookingId(booking.getId()).ifPresent(payment -> {
            if (payment.getStatus() == PaymentStatus.PENDING) {
                payment.setStatus(PaymentStatus.FAILED);
            }
        });

        booking.setStatus(BookingStatus.CANCELLED);

        booking.getBookingSlots().clear();

        return BookingMapper.toResponse(booking, currentPaymentStatus(booking.getId()), null, refundStatus);
    }

    @Override
    @Transactional
    public boolean handlePaymentCallback(Map<String, String> params) {
        GatewayCallbackResult result = paymentGatewayClient.verifyCallback(params);
        Booking booking = getEntityById(result.getBookingId());
        Payment payment = paymentRepository.findByBookingId(booking.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giao dịch thanh toán của booking này"));

        if (payment.getStatus() != PaymentStatus.PENDING) {

            return payment.getStatus() == PaymentStatus.SUCCESS;
        }

        if (result.isSuccess()) {
            payment.setStatus(PaymentStatus.SUCCESS);
            booking.setStatus(BookingStatus.CONFIRMED);
        } else {
            payment.setStatus(PaymentStatus.FAILED);
        }
        return result.isSuccess();
    }

    private void validateMaxConsecutiveSlots(List<TimeSlot> slots) {
        if (slots.size() > MAX_CONSECUTIVE_SLOTS) {
            throw new BusinessRuleViolationException(
                    "Chỉ được đặt tối đa " + MAX_CONSECUTIVE_SLOTS + " khung giờ liên tiếp trong 1 lượt đặt sân");
        }
        for (int i = 1; i < slots.size(); i++) {
            if (!slots.get(i - 1).getEndTime().equals(slots.get(i).getStartTime())) {
                throw new BusinessRuleViolationException("Các khung giờ đã chọn phải liên tiếp nhau, không được bỏ cách quãng");
            }
        }
    }

    private BigDecimal priceForSlot(Court court, TimeSlot slot) {
        for (CourtPrice price : courtPriceRepository.findByCourtId(court.getId())) {
            if (!slot.getStartTime().isBefore(price.getRangeStart()) && slot.getStartTime().isBefore(price.getRangeEnd())) {
                return price.getPrice();
            }
        }
        throw new BusinessRuleViolationException(
                "Chưa cấu hình giá cho khung giờ " + slot.getStartTime() + "-" + slot.getEndTime());
    }

    private RefundStatus currentRefundStatus(Long bookingId) {
        Cancellation cancellation = cancellationRepository.findByBookingId(bookingId).orElse(null);
        return cancellation == null ? null : cancellation.getRefundStatus();
    }

    private PaymentStatus currentPaymentStatus(Long bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId).orElse(null);
        return payment == null ? null : payment.getStatus();
    }
}

