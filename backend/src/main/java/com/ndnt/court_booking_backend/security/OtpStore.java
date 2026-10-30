package com.ndnt.court_booking_backend.security;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class OtpStore {

    private record Entry(String code, Instant expiresAt) {
    }

    private final Map<String, Entry> store = new ConcurrentHashMap<>();
    private final long ttlSeconds;
    private final SecureRandom random = new SecureRandom();

    public OtpStore(@Value("${otp.ttl-seconds:300}") long ttlSeconds) {
        this.ttlSeconds = ttlSeconds;
    }

    public String generate(String email) {
        String code = String.format("%06d", random.nextInt(1_000_000));
        store.put(normalize(email), new Entry(code, Instant.now().plusSeconds(ttlSeconds)));
        return code;
    }

    public boolean verify(String email, String code) {
        String key = normalize(email);
        Entry entry = store.get(key);
        if (entry == null || Instant.now().isAfter(entry.expiresAt())) {
            store.remove(key);
            return false;
        }
        if (!entry.code().equals(code)) {
            return false;
        }
        store.remove(key);
        return true;
    }

    private String normalize(String email) {
        return email.trim().toLowerCase();
    }
}

