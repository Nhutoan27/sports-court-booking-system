package com.ndnt.court_booking_backend.service.impl;

import com.ndnt.court_booking_backend.common.dto.response.PageResponse;
import com.ndnt.court_booking_backend.common.exception.ResourceNotFoundException;
import com.ndnt.court_booking_backend.dto.request.KnowledgeBaseRequest;
import com.ndnt.court_booking_backend.dto.response.KnowledgeBaseResponse;
import com.ndnt.court_booking_backend.entity.KnowledgeBase;
import com.ndnt.court_booking_backend.mapper.KnowledgeBaseMapper;
import com.ndnt.court_booking_backend.repository.KnowledgeBaseRepository;
import com.ndnt.court_booking_backend.service.DocumentIngestionService;
import com.ndnt.court_booking_backend.service.UserService;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DocumentIngestionServiceImpl implements DocumentIngestionService {

    private static final Logger log = LoggerFactory.getLogger(DocumentIngestionServiceImpl.class);

    private final KnowledgeBaseRepository knowledgeBaseRepository;
    private final UserService userService;
    private final VectorStore vectorStore;

    public DocumentIngestionServiceImpl(KnowledgeBaseRepository knowledgeBaseRepository, UserService userService,
                                         VectorStore vectorStore) {
        this.knowledgeBaseRepository = knowledgeBaseRepository;
        this.userService = userService;
        this.vectorStore = vectorStore;
    }

    @Override
    public PageResponse<KnowledgeBaseResponse> listAll(Pageable pageable) {
        return PageResponse.from(knowledgeBaseRepository.findAll(pageable).map(kb -> KnowledgeBaseMapper.toResponse(kb)));
    }

    @Override
    @Transactional
    public KnowledgeBaseResponse create(Long adminId, KnowledgeBaseRequest request) {
        KnowledgeBase kb = new KnowledgeBase();
        kb.setAdmin(userService.getEntityById(adminId));
        kb.setCategory(request.getCategory());
        kb.setTitle(request.getTitle());
        kb.setContent(request.getContent());
        kb = knowledgeBaseRepository.save(kb);

        ingest(kb);
        return KnowledgeBaseMapper.toResponse(kb);
    }

    @Override
    @Transactional
    public KnowledgeBaseResponse update(Long id, KnowledgeBaseRequest request) {
        KnowledgeBase kb = getEntityById(id);
        kb.setCategory(request.getCategory());
        kb.setTitle(request.getTitle());
        kb.setContent(request.getContent());

        vectorStore.delete(List.of(vectorDocId(kb.getId())));
        ingest(kb);

        return KnowledgeBaseMapper.toResponse(kb);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        KnowledgeBase kb = getEntityById(id);
        vectorStore.delete(List.of(vectorDocId(kb.getId())));
        knowledgeBaseRepository.delete(kb);
    }

    private void ingest(KnowledgeBase kb) {
        Document document = new Document(
                vectorDocId(kb.getId()),
                kb.getTitle() + "\n" + kb.getContent(),
                Map.of("knowledgeBaseId", kb.getId().toString(), "category", kb.getCategory(), "title", kb.getTitle()));
        vectorStore.add(List.of(document));
        log.info("DocumentIngestionServiceImpl: đã ingest KnowledgeBase {} ({})", kb.getId(), kb.getTitle());
    }

    private String vectorDocId(Long knowledgeBaseId) {
        return UUID.nameUUIDFromBytes(("knowledge-base-" + knowledgeBaseId).getBytes(StandardCharsets.UTF_8)).toString();
    }

    private KnowledgeBase getEntityById(Long id) {
        return knowledgeBaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Knowledge Base"));
    }
}

