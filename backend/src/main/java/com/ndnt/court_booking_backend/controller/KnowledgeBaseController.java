package com.ndnt.court_booking_backend.controller;

import com.ndnt.court_booking_backend.security.SecurityUtils;
import com.ndnt.court_booking_backend.common.dto.response.ApiResponse;
import com.ndnt.court_booking_backend.common.dto.response.PageResponse;
import com.ndnt.court_booking_backend.dto.request.KnowledgeBaseRequest;
import com.ndnt.court_booking_backend.dto.response.KnowledgeBaseResponse;
import com.ndnt.court_booking_backend.service.DocumentIngestionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "KnowledgeBase", description = "Nội dung tri thức cho chatbot RAG — chỉ Admin")
@PreAuthorize("hasRole('ADMIN')")
@RestController
@RequestMapping("/knowledge-base")
public class KnowledgeBaseController {

    private final DocumentIngestionService documentIngestionService;

    public KnowledgeBaseController(DocumentIngestionService documentIngestionService) {
        this.documentIngestionService = documentIngestionService;
    }

    @GetMapping
    public ApiResponse<PageResponse<KnowledgeBaseResponse>> listAll(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ApiResponse.ok(documentIngestionService.listAll(pageable));
    }

    @PostMapping
    public ApiResponse<KnowledgeBaseResponse> create(@Valid @RequestBody KnowledgeBaseRequest request) {
        KnowledgeBaseResponse created = documentIngestionService.create(SecurityUtils.currentUserId(), request);
        return ApiResponse.ok("Thêm Knowledge Base thành công", created);
    }

    @PatchMapping("/{id}")
    public ApiResponse<KnowledgeBaseResponse> update(@PathVariable Long id, @Valid @RequestBody KnowledgeBaseRequest request) {
        return ApiResponse.ok(documentIngestionService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        documentIngestionService.delete(id);
        return ApiResponse.ok("Xoá Knowledge Base thành công", null);
    }
}

