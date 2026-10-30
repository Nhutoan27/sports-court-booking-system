package com.ndnt.court_booking_backend.mapper;

import com.ndnt.court_booking_backend.dto.response.KnowledgeBaseResponse;
import com.ndnt.court_booking_backend.entity.KnowledgeBase;

public final class KnowledgeBaseMapper {

    private KnowledgeBaseMapper() {
    }

    public static KnowledgeBaseResponse toResponse(KnowledgeBase kb) {
        return new KnowledgeBaseResponse(kb.getId(), kb.getAdmin().getId(), kb.getCategory(), kb.getTitle(), kb.getContent());
    }
}

