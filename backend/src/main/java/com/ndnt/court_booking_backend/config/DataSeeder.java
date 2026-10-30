package com.ndnt.court_booking_backend.config;

import com.ndnt.court_booking_backend.common.enums.BookingStatus;
import com.ndnt.court_booking_backend.common.enums.MatchingInvitationStatus;
import com.ndnt.court_booking_backend.common.enums.MatchingRequestStatus;
import com.ndnt.court_booking_backend.common.enums.PaymentStatus;
import com.ndnt.court_booking_backend.common.enums.RefundStatus;
import com.ndnt.court_booking_backend.common.enums.Role;
import com.ndnt.court_booking_backend.dto.request.KnowledgeBaseRequest;
import com.ndnt.court_booking_backend.entity.Booking;
import com.ndnt.court_booking_backend.entity.BookingSlot;
import com.ndnt.court_booking_backend.entity.Cancellation;
import com.ndnt.court_booking_backend.entity.ChatMessage;
import com.ndnt.court_booking_backend.entity.ChatSession;
import com.ndnt.court_booking_backend.entity.CheckIn;
import com.ndnt.court_booking_backend.entity.Court;
import com.ndnt.court_booking_backend.entity.CourtClosure;
import com.ndnt.court_booking_backend.entity.CourtPrice;
import com.ndnt.court_booking_backend.entity.Match;
import com.ndnt.court_booking_backend.entity.MatchingInvitation;
import com.ndnt.court_booking_backend.entity.MatchingRequest;
import com.ndnt.court_booking_backend.entity.NoShow;
import com.ndnt.court_booking_backend.entity.Payment;
import com.ndnt.court_booking_backend.entity.PlayerProfile;
import com.ndnt.court_booking_backend.entity.Sport;
import com.ndnt.court_booking_backend.entity.SystemConfig;
import com.ndnt.court_booking_backend.entity.TimeSlot;
import com.ndnt.court_booking_backend.entity.User;
import com.ndnt.court_booking_backend.repository.BookingRepository;
import com.ndnt.court_booking_backend.repository.CancellationRepository;
import com.ndnt.court_booking_backend.repository.ChatMessageRepository;
import com.ndnt.court_booking_backend.repository.ChatSessionRepository;
import com.ndnt.court_booking_backend.repository.CheckInRepository;
import com.ndnt.court_booking_backend.repository.CourtClosureRepository;
import com.ndnt.court_booking_backend.repository.CourtPriceRepository;
import com.ndnt.court_booking_backend.repository.CourtRepository;
import com.ndnt.court_booking_backend.repository.MatchRepository;
import com.ndnt.court_booking_backend.repository.MatchingInvitationRepository;
import com.ndnt.court_booking_backend.repository.MatchingRequestRepository;
import com.ndnt.court_booking_backend.repository.NoShowRepository;
import com.ndnt.court_booking_backend.repository.PaymentRepository;
import com.ndnt.court_booking_backend.repository.PlayerProfileRepository;
import com.ndnt.court_booking_backend.repository.SportRepository;
import com.ndnt.court_booking_backend.repository.SystemConfigRepository;
import com.ndnt.court_booking_backend.repository.TimeSlotRepository;
import com.ndnt.court_booking_backend.repository.UserRepository;
import com.ndnt.court_booking_backend.service.DocumentIngestionService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Profile("dev")
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private static final String FREE_TIME_EVENINGS_PLUS_WEEKEND =
            "0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1,1,1,1,1,1";

    private static final String FREE_TIME_WEEKEND_MORNINGS =
            "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0";

    private static final String FREE_TIME_WEEKDAY_AFTERNOONS =
            "0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0";

    private final UserRepository userRepository;
    private final PlayerProfileRepository playerProfileRepository;
    private final SportRepository sportRepository;
    private final CourtRepository courtRepository;
    private final CourtClosureRepository courtClosureRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final CourtPriceRepository courtPriceRepository;
    private final SystemConfigRepository systemConfigRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final CancellationRepository cancellationRepository;
    private final CheckInRepository checkInRepository;
    private final NoShowRepository noShowRepository;
    private final MatchingRequestRepository matchingRequestRepository;
    private final MatchingInvitationRepository matchingInvitationRepository;
    private final MatchRepository matchRepository;
    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final PasswordEncoder passwordEncoder;
    private final DocumentIngestionService documentIngestionService;

    public DataSeeder(UserRepository userRepository, PlayerProfileRepository playerProfileRepository,
                       SportRepository sportRepository, CourtRepository courtRepository,
                       CourtClosureRepository courtClosureRepository, TimeSlotRepository timeSlotRepository,
                       CourtPriceRepository courtPriceRepository, SystemConfigRepository systemConfigRepository,
                       BookingRepository bookingRepository, PaymentRepository paymentRepository,
                       CancellationRepository cancellationRepository, CheckInRepository checkInRepository,
                       NoShowRepository noShowRepository, MatchingRequestRepository matchingRequestRepository,
                       MatchingInvitationRepository matchingInvitationRepository, MatchRepository matchRepository,
                       ChatSessionRepository chatSessionRepository, ChatMessageRepository chatMessageRepository,
                       PasswordEncoder passwordEncoder, DocumentIngestionService documentIngestionService) {
        this.userRepository = userRepository;
        this.playerProfileRepository = playerProfileRepository;
        this.sportRepository = sportRepository;
        this.courtRepository = courtRepository;
        this.courtClosureRepository = courtClosureRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.courtPriceRepository = courtPriceRepository;
        this.systemConfigRepository = systemConfigRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.cancellationRepository = cancellationRepository;
        this.checkInRepository = checkInRepository;
        this.noShowRepository = noShowRepository;
        this.matchingRequestRepository = matchingRequestRepository;
        this.matchingInvitationRepository = matchingInvitationRepository;
        this.matchRepository = matchRepository;
        this.chatSessionRepository = chatSessionRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.passwordEncoder = passwordEncoder;
        this.documentIngestionService = documentIngestionService;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("DataSeeder: DB đã có dữ liệu, bỏ qua seed mẫu.");
            return;
        }
        log.info("DataSeeder: DB trống, bắt đầu seed dữ liệu mẫu cho toàn bộ 20 bảng...");

        Users users = seedUsers();
        seedPlayerProfiles(users);
        Catalog catalog = seedCatalog();
        seedSystemConfig(users.admin);
        seedBookings(users, catalog);
        seedMatching(users);
        seedChat(users);
        seedKnowledgeBase(users.admin);

        log.info("DataSeeder: seed dữ liệu mẫu hoàn tất. Xem tài khoản test trong log phía trên/README.");
    }

    private static class Users {
        final User admin;
        final User staff;
        final User player1;
        final User player2;
        final User player3;
        final User player4;
        final User player5;

        Users(User admin, User staff, User player1, User player2, User player3, User player4, User player5) {
            this.admin = admin;
            this.staff = staff;
            this.player1 = player1;
            this.player2 = player2;
            this.player3 = player3;
            this.player4 = player4;
            this.player5 = player5;
        }

        List<User> players() {
            return List.of(player1, player2, player3, player4, player5);
        }
    }

    private Users seedUsers() {
        User admin = newUser("Quản trị viên", "admin@courtbooking.local", "Admin@123",
                "0900000001", Role.ADMIN, "MALE", LocalDate.of(1990, 1, 1));
        User staff = newUser("Nhân viên Lễ tân", "staff@courtbooking.local", "Staff@123",
                "0900000002", Role.STAFF, "FEMALE", LocalDate.of(1995, 5, 20));

        User player1 = newUser("Nguyễn Văn An", "an.nguyen@example.com", "Player@123",
                "0911111111", Role.PLAYER, "MALE", LocalDate.of(1999, 3, 10));
        User player2 = newUser("Trần Thị Bình", "binh.tran@example.com", "Player@123",
                "0922222222", Role.PLAYER, "FEMALE", LocalDate.of(2000, 7, 15));
        User player3 = newUser("Lê Hoàng Cường", "cuong.le@example.com", "Player@123",
                "0933333333", Role.PLAYER, "MALE", LocalDate.of(1996, 11, 2));
        User player4 = newUser("Phạm Thị Duyên", "duyen.pham@example.com", "Player@123",
                "0944444444", Role.PLAYER, "FEMALE", LocalDate.of(1988, 4, 25));
        User player5 = newUser("Đỗ Minh Em", "em.do@example.com", "Player@123",
                "0955555555", Role.PLAYER, "MALE", LocalDate.of(2002, 9, 30));

        log.info("DataSeeder: tài khoản test — admin@courtbooking.local / Admin@123, "
                + "staff@courtbooking.local / Staff@123, các player *@example.com đều dùng mật khẩu Player@123.");

        return new Users(admin, staff, player1, player2, player3, player4, player5);
    }

    private User newUser(String fullName, String email, String rawPassword, String phone, Role role,
                          String gender, LocalDate dob) {
        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setPhone(phone);
        user.setDob(dob);
        user.setGender(gender);
        user.setRole(role);
        user.setStatus("ACTIVE");
        return userRepository.save(user);
    }

    private void seedPlayerProfiles(Users users) {
        seedPlayerProfile(users.player1, "Cầu lông", 3, "INTERMEDIATE", FREE_TIME_EVENINGS_PLUS_WEEKEND);
        seedPlayerProfile(users.player2, "Cầu lông", 3, "INTERMEDIATE", FREE_TIME_EVENINGS_PLUS_WEEKEND);
        seedPlayerProfile(users.player3, "Pickleball", 1, "BEGINNER", FREE_TIME_WEEKEND_MORNINGS);
        seedPlayerProfile(users.player4, "Cầu lông", 5, "ADVANCED", FREE_TIME_WEEKDAY_AFTERNOONS);
        seedPlayerProfile(users.player5, "Pickleball", 0, "BEGINNER", FREE_TIME_WEEKEND_MORNINGS);
    }

    private void seedPlayerProfile(User user, String favoriteSport, int years, String skillLevel,
                                    String freeTimeVector) {
        PlayerProfile profile = new PlayerProfile();
        profile.setUser(user);
        profile.setFavoriteSport(favoriteSport);
        profile.setYearsExperience(years);
        profile.setSkillLevel(skillLevel);
        profile.setFreeTimeVector(freeTimeVector);
        playerProfileRepository.save(profile);
    }

    private static class CourtWithSlots {
        final Court court;
        final Map<Integer, TimeSlot> slotsByHour;

        CourtWithSlots(Court court, Map<Integer, TimeSlot> slotsByHour) {
            this.court = court;
            this.slotsByHour = slotsByHour;
        }
    }

    private static class Catalog {
        final Sport badminton;
        final Sport pickleball;
        final Map<String, CourtWithSlots> courtsByCode;

        Catalog(Sport badminton, Sport pickleball, Map<String, CourtWithSlots> courtsByCode) {
            this.badminton = badminton;
            this.pickleball = pickleball;
            this.courtsByCode = courtsByCode;
        }
    }

    private Catalog seedCatalog() {
        Sport badminton = new Sport();
        badminton.setName("Cầu lông");
        badminton.setStatus("ACTIVE");
        badminton = sportRepository.save(badminton);

        Sport pickleball = new Sport();
        pickleball.setName("Pickleball");
        pickleball.setStatus("ACTIVE");
        pickleball = sportRepository.save(pickleball);

        Map<String, CourtWithSlots> courts = new HashMap<>();

        courts.put("CL-1", seedCourt(badminton, "Sân 1", new BigDecimal("80000"), new BigDecimal("120000")));
        courts.put("CL-2", seedCourt(badminton, "Sân 2", new BigDecimal("80000"), new BigDecimal("120000")));
        courts.put("CL-3", seedCourt(badminton, "Sân 3", new BigDecimal("80000"), new BigDecimal("120000")));

        courts.put("PB-A", seedCourt(pickleball, "Sân A", new BigDecimal("100000"), new BigDecimal("150000")));
        courts.put("PB-B", seedCourt(pickleball, "Sân B", new BigDecimal("100000"), new BigDecimal("150000")));

        CourtClosure closure = new CourtClosure();
        closure.setCourt(courts.get("CL-3").court);
        closure.setStartTime(LocalDate.now().plusDays(2).atTime(9, 0));
        closure.setEndTime(LocalDate.now().plusDays(2).atTime(12, 0));
        courtClosureRepository.save(closure);

        return new Catalog(badminton, pickleball, courts);
    }

    private CourtWithSlots seedCourt(Sport sport, String name, BigDecimal normalPrice, BigDecimal peakPrice) {
        Court court = new Court();
        court.setSport(sport);
        court.setName(name);
        court.setStatus("ACTIVE");
        court = courtRepository.save(court);

        Map<Integer, TimeSlot> slotsByHour = new HashMap<>();
        for (int hour = 6; hour < 22; hour++) {
            TimeSlot slot = new TimeSlot();
            slot.setCourt(court);
            slot.setStartTime(LocalTime.of(hour, 0));
            slot.setEndTime(LocalTime.of(hour + 1, 0));
            slotsByHour.put(hour, timeSlotRepository.save(slot));
        }

        seedCourtPrice(court, LocalTime.of(6, 0), LocalTime.of(17, 0), normalPrice);
        seedCourtPrice(court, LocalTime.of(17, 0), LocalTime.of(22, 0), peakPrice);

        return new CourtWithSlots(court, slotsByHour);
    }

    private void seedCourtPrice(Court court, LocalTime start, LocalTime end, BigDecimal price) {
        CourtPrice courtPrice = new CourtPrice();
        courtPrice.setCourt(court);
        courtPrice.setRangeStart(start);
        courtPrice.setRangeEnd(end);
        courtPrice.setPrice(price);
        courtPriceRepository.save(courtPrice);
    }

    private void seedSystemConfig(User admin) {
        SystemConfig config = new SystemConfig();
        config.setAdmin(admin);
        config.setDepositPercentage(new BigDecimal("30.00"));
        config.setCancelHours(2);
        config.setHoldMinutes(5);
        config.setNoShowMinutes(15);
        config.setEffectiveFrom(LocalDate.now().minusMonths(1).atStartOfDay());
        systemConfigRepository.save(config);
    }

    private void seedBookings(Users users, Catalog catalog) {
        CourtWithSlots cl1 = catalog.courtsByCode.get("CL-1");
        CourtWithSlots cl2 = catalog.courtsByCode.get("CL-2");
        CourtWithSlots pbA = catalog.courtsByCode.get("PB-A");
        CourtWithSlots pbB = catalog.courtsByCode.get("PB-B");

        createBooking(users.player1, cl1, LocalDate.now().plusDays(1), 19,
                new BigDecimal("120000"), new BigDecimal("36000"), BookingStatus.PENDING);

        Booking b2 = createBooking(users.player2, pbA, LocalDate.now().plusDays(2), 8,
                new BigDecimal("100000"), new BigDecimal("30000"), BookingStatus.CONFIRMED);
        seedPayment(b2, new BigDecimal("30000"), PaymentStatus.SUCCESS);

        Booking b3 = createBooking(users.player3, cl2, LocalDate.now().minusDays(5), 18,
                new BigDecimal("120000"), new BigDecimal("36000"), BookingStatus.COMPLETED);
        seedPayment(b3, new BigDecimal("36000"), PaymentStatus.SUCCESS);
        seedCheckIn(b3, users.staff, LocalDate.now().minusDays(5).atTime(17, 55));

        Booking b4 = createBooking(users.player4, pbB, LocalDate.now().minusDays(3), 20,
                new BigDecimal("150000"), new BigDecimal("45000"), BookingStatus.NO_SHOW);
        seedPayment(b4, new BigDecimal("45000"), PaymentStatus.SUCCESS);
        seedNoShow(b4, users.staff, LocalDate.now().minusDays(3).atTime(20, 16));

        Booking b5 = createBooking(users.player5, cl1, LocalDate.now().minusDays(1), 9,
                new BigDecimal("80000"), new BigDecimal("24000"), BookingStatus.CANCELLED);
        seedPayment(b5, new BigDecimal("24000"), PaymentStatus.SUCCESS);
        seedCancellation(b5, RefundStatus.DA_HOAN_COC);
    }

    private Booking createBooking(User user, CourtWithSlots courtWithSlots, LocalDate playDate, int hour,
                                   BigDecimal totalPrice, BigDecimal depositAmount, BookingStatus status) {
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setCourt(courtWithSlots.court);
        booking.setPlayDate(playDate);
        booking.setTotalPrice(totalPrice);
        booking.setDepositAmount(depositAmount);
        booking.setStatus(status);

        BookingSlot slot = new BookingSlot();
        slot.setBooking(booking);
        slot.setTimeSlot(courtWithSlots.slotsByHour.get(hour));
        slot.setCourtId(courtWithSlots.court.getId());
        slot.setPlayDate(playDate);
        booking.getBookingSlots().add(slot);

        return bookingRepository.save(booking);
    }

    private void seedPayment(Booking booking, BigDecimal amount, PaymentStatus status) {
        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(amount);
        payment.setMethod("MOCK");
        payment.setStatus(status);
        paymentRepository.save(payment);
    }

    private void seedCheckIn(Booking booking, User staff, LocalDateTime checkedInAt) {
        CheckIn checkIn = new CheckIn();
        checkIn.setBooking(booking);
        checkIn.setStaff(staff);
        checkIn.setCheckedInAt(checkedInAt);
        checkInRepository.save(checkIn);
    }

    private void seedNoShow(Booking booking, User staff, LocalDateTime markedAt) {
        NoShow noShow = new NoShow();
        noShow.setBooking(booking);
        noShow.setStaff(staff);
        noShow.setMarkedAt(markedAt);
        noShowRepository.save(noShow);
    }

    private void seedCancellation(Booking booking, RefundStatus refundStatus) {
        Cancellation cancellation = new Cancellation();
        cancellation.setBooking(booking);
        cancellation.setRefundStatus(refundStatus);
        cancellationRepository.save(cancellation);
    }

    private void seedMatching(Users users) {
        Sport badminton = findSportByName("Cầu lông");
        Sport pickleball = findSportByName("Pickleball");

        MatchingRequest req1 = newMatchingRequest(users.player1, badminton, 25f, 3f, "INTERMEDIATE",
                FREE_TIME_EVENINGS_PLUS_WEEKEND, MatchingRequestStatus.DA_GHEP);

        newMatchingRequest(users.player2, badminton, 25f, 3f, "INTERMEDIATE",
                FREE_TIME_EVENINGS_PLUS_WEEKEND, MatchingRequestStatus.DA_GHEP);
        newMatchingRequest(users.player3, pickleball, 30f, 1f, "BEGINNER",
                FREE_TIME_WEEKEND_MORNINGS, MatchingRequestStatus.DANG_TIM);
        MatchingRequest req4 = newMatchingRequest(users.player4, badminton, 40f, 5f, "ADVANCED",
                FREE_TIME_WEEKDAY_AFTERNOONS, MatchingRequestStatus.HET_HAN);

        seedInvitation(req1, users.player1, users.player2, 1.0f, MatchingInvitationStatus.ACCEPTED);
        seedInvitation(req4, users.player4, users.player1, 0.71f, MatchingInvitationStatus.REJECTED);

        Match match = new Match();
        match.setUser1(users.player1);
        match.setUser2(users.player2);
        match.setSport(badminton);
        match.setMatchedAt(LocalDateTime.now().minusDays(1));
        matchRepository.save(match);
    }

    private Sport findSportByName(String name) {
        for (Sport sport : sportRepository.findAll()) {
            if (sport.getName().equals(name)) {
                return sport;
            }
        }
        throw new IllegalStateException("Không tìm thấy môn thể thao: " + name);
    }

    private MatchingRequest newMatchingRequest(User user, Sport sport, float age, float experience,
                                                String skillLevel, String freeTimeVector,
                                                MatchingRequestStatus status) {
        MatchingRequest request = new MatchingRequest();
        request.setUser(user);
        request.setSport(sport);
        request.setAge(age);
        request.setExperience(experience);
        request.setSkillLevel(skillLevel);
        request.setFreeTimeVector(freeTimeVector);
        request.setStatus(status);
        return matchingRequestRepository.save(request);
    }

    private void seedInvitation(MatchingRequest request, User sender, User receiver, float similarityScore,
                                 MatchingInvitationStatus status) {
        MatchingInvitation invitation = new MatchingInvitation();
        invitation.setMatchingRequest(request);
        invitation.setSender(sender);
        invitation.setReceiver(receiver);
        invitation.setSimilarityScore(similarityScore);
        invitation.setStatus(status);
        matchingInvitationRepository.save(invitation);
    }

    private void seedChat(Users users) {
        seedChatSession(null,
                "Sân mở cửa mấy giờ?",
                "Sân mở cửa phục vụ từ 6:00 sáng đến 22:00 tối tất cả các ngày trong tuần.",
                "KnowledgeBase: Giờ hoạt động");

        seedChatSession(users.player1,
                "Chính sách hủy sân thế nào?",
                "Bạn có thể hủy miễn phí trước giờ chơi 2 tiếng và được hoàn 100% tiền cọc. "
                        + "Hủy trễ hơn hoặc không đến chơi sẽ không được hoàn cọc.",
                "KnowledgeBase: Hủy đặt sân & hoàn cọc");
    }

    private void seedChatSession(User user, String userMessage, String botMessage, String sourceReference) {
        ChatSession session = new ChatSession();
        session.setUser(user);
        session.setSessionToken(UUID.randomUUID().toString());

        ChatMessage userMsg = new ChatMessage();
        userMsg.setChatSession(session);
        userMsg.setSender("USER");
        userMsg.setContent(userMessage);
        session.getChatMessages().add(userMsg);

        ChatMessage botMsg = new ChatMessage();
        botMsg.setChatSession(session);
        botMsg.setSender("BOT");
        botMsg.setContent(botMessage);
        botMsg.setSourceReference(sourceReference);
        session.getChatMessages().add(botMsg);

        chatSessionRepository.save(session);
    }

    private void seedKnowledgeBase(User admin) {
        List<KnowledgeBaseRequest> entries = List.of(
                kb("Chính sách", "Đặt cọc khi đặt sân",
                        "Khi đặt sân, bạn cần thanh toán trước 30% giá trị đơn đặt sân làm tiền cọc qua "
                                + "cổng thanh toán MoMo. Số tiền còn lại thanh toán trực tiếp tại sân."),
                kb("Chính sách", "Hủy đặt sân & hoàn cọc",
                        "Bạn có thể hủy đặt sân miễn phí trước giờ chơi ít nhất 2 tiếng và được hoàn 100% "
                                + "tiền cọc. Nếu hủy trễ hơn 2 tiếng hoặc không đến chơi (no-show), tiền cọc "
                                + "sẽ không được hoàn lại."),
                kb("Chính sách", "Giữ chỗ tạm thời",
                        "Sau khi chọn khung giờ, hệ thống sẽ giữ chỗ tạm cho bạn trong 5 phút để hoàn tất "
                                + "thanh toán cọc. Nếu quá 5 phút chưa thanh toán, chỗ sẽ tự động được giải "
                                + "phóng cho người khác đặt."),
                kb("Chính sách", "Quy định no-show",
                        "Nếu bạn đã đặt sân và thanh toán cọc nhưng không đến chơi, nhân viên sẽ đánh dấu "
                                + "no-show sau 15 phút kể từ giờ bắt đầu nếu bạn chưa check-in. Trường hợp "
                                + "no-show sẽ không được hoàn cọc."),
                kb("Chính sách", "Thanh toán phần còn lại tại sân",
                        "Sau khi đặt cọc 30% giá trị đơn qua MoMo để giữ chỗ, 70% giá trị còn lại được "
                                + "thanh toán trực tiếp tại quầy lễ tân khi bạn đến chơi. Nhân viên lễ tân "
                                + "là người thu khoản này và thực hiện check-in cho bạn."),
                kb("Chính sách", "Đổi lịch (dời giờ) đặt sân",
                        "Hệ thống hiện chưa hỗ trợ dời lịch/đổi khung giờ cho một đơn đặt sân đã tạo. Nếu "
                                + "muốn đổi sang ngày giờ khác, bạn cần hủy đơn cũ (tuân theo chính sách hủy "
                                + "và hoàn cọc) rồi tạo một đơn đặt sân mới cho khung giờ mong muốn."),
                kb("Chính sách", "Phân quyền tài khoản trong hệ thống",
                        "Hệ thống có 3 vai trò: Player (người chơi, tự đăng ký, đặt sân/tìm người chơi cùng), "
                                + "Staff (nhân viên lễ tân, thực hiện check-in và đánh dấu no-show tại sân), "
                                + "và Admin (quản trị viên, quản lý sân/giá/cấu hình hệ thống, Knowledge Base "
                                + "và xem báo cáo doanh thu). Chỉ Player mới tự đăng ký được; tài khoản Staff "
                                + "và Admin do Admin tạo/cấp."),

                kb("Thông tin chung", "Giờ hoạt động",
                        "Hệ thống sân mở cửa phục vụ từ 6:00 sáng đến 22:00 tối tất cả các ngày trong tuần, "
                                + "bao gồm cả cầu lông và pickleball."),
                kb("Thông tin chung", "Ghép cặp chơi cùng (Matching)",
                        "Bạn có thể tìm người chơi cùng phù hợp dựa trên độ tuổi, kinh nghiệm, trình độ và "
                                + "khung giờ rảnh. Hệ thống chỉ gợi ý những người có độ tương đồng từ 70% trở lên."),
                kb("Thông tin chung", "Các môn thể thao được hỗ trợ",
                        "Hệ thống hiện hỗ trợ 2 môn: Cầu lông (3 sân: Sân 1, Sân 2, Sân 3) và Pickleball "
                                + "(2 sân: Sân A, Sân B). Mỗi sân có khung giờ và bảng giá riêng."),
                kb("Thông tin chung", "Khung giờ đặt sân",
                        "Mỗi sân được chia thành các khung giờ (time slot) dài 1 tiếng, liên tục từ 6:00 đến "
                                + "22:00 mỗi ngày. Khi đặt sân bạn chọn một hoặc nhiều khung giờ trống trong "
                                + "ngày muốn chơi; các khung giờ đã có người đặt (hoặc đang được giữ chỗ) sẽ "
                                + "không hiển thị để đặt trùng."),
                kb("Thông tin chung", "Giá thuê sân theo khung giờ",
                        "Giá sân được chia theo khung giờ thường và khung giờ cao điểm trong ngày, KHÔNG phân "
                                + "biệt ngày thường hay cuối tuần (thứ Bảy, Chủ nhật áp dụng giá giống hệt các "
                                + "ngày trong tuần). Với sân cầu lông: 80.000đ/giờ (6:00–17:00, giờ thường) và "
                                + "120.000đ/giờ (17:00–22:00, giờ cao điểm). Với sân pickleball: 100.000đ/giờ "
                                + "(6:00–17:00, giờ thường) và 150.000đ/giờ (17:00–22:00, giờ cao điểm). Ví dụ: "
                                + "đặt sân cầu lông lúc 13:00 (1 giờ chiều) vào cuối tuần vẫn tính giá giờ "
                                + "thường 80.000đ/giờ, không có phụ thu cuối tuần. Giá có thể được Admin điều "
                                + "chỉnh theo từng sân."),
                kb("Thông tin chung", "Sân tạm ngừng phục vụ (bảo trì/đóng sân)",
                        "Admin có thể đặt lịch đóng sân tạm thời (ví dụ để bảo trì) cho một khoảng thời gian "
                                + "cụ thể trên một sân. Trong khoảng thời gian đó, sân sẽ không hiển thị để "
                                + "đặt, kể cả khi khung giờ đó chưa có ai đặt."),
                kb("Thông tin chung", "Phương thức thanh toán hỗ trợ",
                        "Tiền cọc đặt sân được thanh toán online qua cổng MoMo. Sau khi thanh toán thành "
                                + "công, hệ thống tự động xác nhận đơn đặt sân (chuyển trạng thái sang "
                                + "CONFIRMED). Phần còn lại (70% giá trị đơn) thanh toán bằng tiền mặt hoặc "
                                + "hình thức khác trực tiếp tại sân."),

                kb("Hướng dẫn sử dụng", "Các bước đặt sân",
                        "1) Chọn môn thể thao (cầu lông/pickleball) và sân. 2) Chọn ngày chơi và một hoặc "
                                + "nhiều khung giờ còn trống. 3) Xác nhận đơn, hệ thống giữ chỗ tạm trong 5 "
                                + "phút. 4) Thanh toán cọc 30% qua MoMo trong thời gian giữ chỗ để xác nhận "
                                + "đơn. 5) Đến sân đúng giờ, thanh toán 70% còn lại và được nhân viên check-in."),
                kb("Hướng dẫn sử dụng", "Cách hủy đặt sân",
                        "Vào mục lịch đặt sân của tôi, chọn đơn muốn hủy và bấm Hủy đặt sân. Nếu hủy trước "
                                + "giờ chơi ít nhất 2 tiếng, bạn được hoàn 100% tiền cọc; hủy trễ hơn sẽ không "
                                + "được hoàn cọc."),
                kb("Hướng dẫn sử dụng", "Cách check-in khi đến sân",
                        "Khi bạn đến sân, nhân viên lễ tân sẽ tra cứu đơn đặt sân của bạn và thực hiện "
                                + "check-in sau khi bạn thanh toán phần còn lại. Nếu quá 15 phút kể từ giờ bắt "
                                + "đầu mà chưa check-in, đơn sẽ tự động bị đánh dấu no-show và mất tiền cọc."),
                kb("Hướng dẫn sử dụng", "Cách tìm người chơi cùng",
                        "Vào mục Ghép cặp, tạo một yêu cầu tìm người chơi cùng với môn thể thao, độ tuổi, "
                                + "kinh nghiệm, trình độ và khung giờ rảnh của bạn. Hệ thống sẽ gợi ý các ứng "
                                + "viên có độ tương đồng từ 70% trở lên để bạn gửi lời mời ghép cặp."),
                kb("Hướng dẫn sử dụng", "Quên mật khẩu",
                        "Trên màn hình đăng nhập, chọn Quên mật khẩu và nhập email đã đăng ký. Hệ thống gửi "
                                + "mã OTP tới email đó; nhập mã OTP cùng mật khẩu mới để đặt lại mật khẩu."),

                kb("Ghép cặp (Matching)", "Tiêu chí ghép cặp chơi cùng",
                        "Hệ thống so khớp người chơi dựa trên 4 yếu tố: độ tuổi, số năm kinh nghiệm, trình độ "
                                + "kỹ năng (skill level) và khung giờ rảnh trong tuần (7 ngày x 3 buổi sáng/"
                                + "chiều/tối). Các yếu tố này được mã hóa thành vector và so sánh bằng độ đo "
                                + "cosine similarity; chỉ những cặp có độ tương đồng từ 70% (0.7) trở lên mới "
                                + "được gợi ý ghép."),
                kb("Ghép cặp (Matching)", "Phân loại trình độ kỹ năng",
                        "Trình độ kỹ năng của người chơi được phân theo 3 mức: BEGINNER (mới bắt đầu), "
                                + "INTERMEDIATE (trung bình) và ADVANCED (nâng cao). Đây là một trong các tiêu "
                                + "chí dùng để tính độ tương đồng khi ghép cặp chơi cùng."),
                kb("Ghép cặp (Matching)", "Gửi và phản hồi lời mời ghép cặp",
                        "Sau khi xem danh sách ứng viên phù hợp, bạn có thể gửi lời mời ghép cặp tới một "
                                + "người chơi khác. Người nhận có thể chấp nhận (ACCEPTED) hoặc từ chối "
                                + "(REJECTED) lời mời; người gửi cũng có thể hủy lời mời đã gửi (CANCELLED) "
                                + "nếu chưa được phản hồi. Khi lời mời được chấp nhận, một cặp Match được tạo."),
                kb("Ghép cặp (Matching)", "Trạng thái của yêu cầu tìm người chơi cùng",
                        "Một yêu cầu ghép cặp có 3 trạng thái: DANG_TIM (đang tìm người chơi phù hợp), "
                                + "DA_GHEP (đã ghép được với người chơi khác) và HET_HAN (đã hết hạn tìm kiếm "
                                + "mà chưa ghép được ai). Bạn có thể chủ động hủy yêu cầu khi đang ở trạng thái "
                                + "DANG_TIM."),

                kb("Tài khoản", "Đăng ký tài khoản",
                        "Chỉ người chơi (Player) mới có thể tự đăng ký tài khoản trên hệ thống, với các "
                                + "thông tin họ tên, email, mật khẩu, số điện thoại, ngày sinh và giới tính. "
                                + "Tài khoản Nhân viên (Staff) và Quản trị viên (Admin) do Admin tạo, không "
                                + "đăng ký công khai được."),
                kb("Tài khoản", "Hồ sơ người chơi (Player Profile)",
                        "Mỗi người chơi có thể khai báo hồ sơ gồm môn thể thao yêu thích, số năm kinh nghiệm, "
                                + "trình độ kỹ năng và khung giờ rảnh trong tuần. Thông tin này dùng để gợi ý "
                                + "ghép cặp chơi cùng phù hợp hơn."),

                kb("Chatbot", "Chatbot trả lời dựa trên nguồn nào",
                        "Chatbot của hệ thống trả lời câu hỏi dựa trên nội dung được lưu trong Knowledge Base "
                                + "(do Admin biên soạn và cập nhật) bằng kỹ thuật truy hồi có tăng cường sinh "
                                + "(RAG). Nếu một câu hỏi chưa có thông tin tương ứng trong Knowledge Base, "
                                + "chatbot có thể trả lời không chính xác hoặc không trả lời được; trong "
                                + "trường hợp đó bạn nên liên hệ trực tiếp nhân viên lễ tân hoặc quản trị viên.")
        );

        int ingested = 0;
        for (KnowledgeBaseRequest entry : entries) {
            try {
                documentIngestionService.create(admin.getId(), entry);
                ingested++;
            } catch (Exception e) {
                log.warn("DataSeeder: bỏ qua ingest Knowledge Base '{}' — lỗi: {} (Ollama đã chạy + "
                        + "đã pull model embedding chưa?)", entry.getTitle(), e.getMessage());
            }
        }
        log.info("DataSeeder: đã ingest {}/{} mục Knowledge Base.", ingested, entries.size());
    }

    private KnowledgeBaseRequest kb(String category, String title, String content) {
        KnowledgeBaseRequest request = new KnowledgeBaseRequest();
        request.setCategory(category);
        request.setTitle(title);
        request.setContent(content);
        return request;
    }
}

