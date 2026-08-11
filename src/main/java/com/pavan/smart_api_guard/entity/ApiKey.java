
package com.pavan.smart_api_guard.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "api_keys")
public class ApiKey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String keyValue;

    @Column(nullable = false)
    private String tier = "FREE";

    @Column(nullable = false)
    private int rateLimit = 10;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    // =====================================================
    // DEFAULT CONSTRUCTOR
    // =====================================================

    public ApiKey() {
    }

    // =====================================================
    // DEFAULT API KEY CONSTRUCTOR
    // =====================================================

    public ApiKey(String name, String keyValue) {

        this.name = name;
        this.keyValue = keyValue;

        this.tier = "FREE";
        this.rateLimit = 10;

        this.active = true;
        this.createdAt = LocalDateTime.now();
    }

    // =====================================================
    // FULL CONSTRUCTOR
    // =====================================================

    public ApiKey(
            String name,
            String keyValue,
            String tier,
            int rateLimit) {

        this.name = name;
        this.keyValue = keyValue;

        this.tier = tier;
        this.rateLimit = rateLimit;

        this.active = true;
        this.createdAt = LocalDateTime.now();
    }

    // =====================================================
    // PRE PERSIST
    // =====================================================

    @PrePersist
    public void prePersist() {

        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }

        if (tier == null || tier.isBlank()) {
            tier = "FREE";
        }

        if (rateLimit <= 0) {
            rateLimit = 10;
        }

        if (keyValue == null || keyValue.isBlank()) {
            throw new IllegalStateException(
                    "API key value cannot be empty"
            );
        }
    }

    // =====================================================
    // GETTERS / SETTERS
    // =====================================================

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getKeyValue() {
        return keyValue;
    }

    public void setKeyValue(String keyValue) {
        this.keyValue = keyValue;
    }

    public String getTier() {
        return tier;
    }

    public void setTier(String tier) {
        this.tier = tier;
    }

    public int getRateLimit() {
        return rateLimit;
    }

    public void setRateLimit(int rateLimit) {
        this.rateLimit = rateLimit;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
