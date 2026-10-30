package com.ndnt.court_booking_backend.service.impl;

import com.ndnt.court_booking_backend.service.RetrievalService;
import java.util.List;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

@Service
public class RetrievalServiceImpl implements RetrievalService {

    private static final double SIMILARITY_THRESHOLD = 0.7;
    private static final int TOP_K = 5;

    private final VectorStore vectorStore;

    public RetrievalServiceImpl(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    @Override
    public List<Document> retrieve(String query) {
        SearchRequest request = SearchRequest.builder()
                .query(query)
                .topK(TOP_K)
                .similarityThreshold(SIMILARITY_THRESHOLD)
                .build();
        return vectorStore.similaritySearch(request);
    }
}

