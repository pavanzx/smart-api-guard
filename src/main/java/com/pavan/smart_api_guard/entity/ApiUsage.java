package com.pavan.smart_api_guard.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "api_usage")
public class ApiUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @Column(name = "api_key", nullable = false)
    private String apiKey;

    @Column(name = "endpoint", nullable = false)
    private String endpoint;

    @Column(name = "http_status", nullable = false)
    private int httpStatus;

    @Column(name = "allowed", nullable = false)
    private boolean allowed;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public ApiUsage() {
    }

    public ApiUsage(
            String apiKey,
            String endpoint,
            int httpStatus,
            boolean allowed,
            LocalDateTime createdAt) {

        this.apiKey = apiKey;
        this.endpoint = endpoint;
        this.httpStatus = httpStatus;
        this.allowed = allowed;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getApiKey() {
        return apiKey;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public int getHttpStatus() {
        return httpStatus;
    }

    public boolean isAllowed() {
        return allowed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
