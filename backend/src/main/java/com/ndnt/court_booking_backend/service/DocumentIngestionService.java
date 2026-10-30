package com.ndnt.court_booking_backend.service;

import com.ndnt.court_booking_backend.common.dto.response.PageResponse;
import com.ndnt.court_booking_backend.dto.request.KnowledgeBaseRequest;
import com.ndnt.court_booking_backend.dto.response.KnowledgeBaseResponse;
import org.springframework.data.domain.Pageable;

public interface DocumentIngestionService {

    PageResponse<KnowledgeBaseResponse> listAll(Pageable pageable);

    KnowledgeBaseResponse create(Long adminId, KnowledgeBaseRequest request);

    KnowledgeBaseResponse update(Long id, KnowledgeBaseRequest request);

    void delete(Long id);
}

