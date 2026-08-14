package com.pavan.smart_api_guard.controller;

import com.pavan.smart_api_guard.entity.ApiUsage;
import com.pavan.smart_api_guard.repository.ApiUsageRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UsageControllerTest {

    private ApiUsageRepository apiUsageRepository;
    private UsageController usageController;

    @BeforeEach
    void setUp() {

        apiUsageRepository = mock(ApiUsageRepository.class);

        usageController =
                new UsageController(apiUsageRepository);
    }

    // =====================================================
    // STATS TEST
    // =====================================================

    @Test
    void statsShouldReturnCorrectCounts() {

        LocalDateTime now = LocalDateTime.now();

        ApiUsage successful =
                new ApiUsage(
                        "FREE-KEY",
                        "/api/test",
                        200,
                        true,
                        now
                );

        ApiUsage unauthorized =
                new ApiUsage(
                        "BAD-KEY",
                        "/api/test",
                        401,
                        false,
                        now
                );

        ApiUsage rateLimited =
                new ApiUsage(
                        "FREE-KEY",
                        "/api/test",
                        429,
                        false,
                        now
                );

        when(apiUsageRepository.findAll())
                .thenReturn(
                        List.of(
                                successful,
                                unauthorized,
                                rateLimited
                        )
                );

        Map<String, Long> stats =
                usageController.getStats();

        assertEquals(
                3L,
                stats.get("totalRequests")
        );

        assertEquals(
                1L,
                stats.get("successfulRequests")
        );

        assertEquals(
                2L,
                stats.get("blockedRequests")
        );

        assertEquals(
                1L,
                stats.get("unauthorizedRequests")
        );

        assertEquals(
                1L,
                stats.get("rateLimitedRequests")
        );
    }

    // =====================================================
    // RECENT USAGE TEST
    // =====================================================

    @Test
    void recentUsageShouldReturnLatestRequests() {

        LocalDateTime now = LocalDateTime.now();

        ApiUsage usage =
                new ApiUsage(
                        "TEST-KEY",
                        "/api/test",
                        200,
                        true,
                        now
                );

        when(apiUsageRepository
                .findTop20ByOrderByCreatedAtDesc())
                .thenReturn(List.of(usage));

        List<Map<String, Object>> result =
                usageController.getRecentUsage();

        assertEquals(
                1,
                result.size()
        );

        Map<String, Object> data =
                result.get(0);

        assertEquals(
                "TEST-KEY",
                data.get("apiKey")
        );

        assertEquals(
                "/api/test",
                data.get("endpoint")
        );

        assertEquals(
                200,
                data.get("httpStatus")
        );

        assertEquals(
                true,
                data.get("allowed")
        );

        assertEquals(
                now,
                data.get("createdAt")
        );
    }

    // =====================================================
    // ANALYTICS TEST
    // =====================================================

    @Test
    void analyticsShouldCountEndpointsAndStatuses() {

        LocalDateTime now = LocalDateTime.now();

        ApiUsage first =
                new ApiUsage(
                        "KEY-1",
                        "/api/users",
                        200,
                        true,
                        now
                );

        ApiUsage second =
                new ApiUsage(
                        "KEY-1",
                        "/api/users",
                        200,
                        true,
                        now
                );

        ApiUsage third =
                new ApiUsage(
                        "KEY-2",
                        "/api/orders",
                        401,
                        false,
                        now
                );

        when(apiUsageRepository.findAll())
                .thenReturn(
                        List.of(
                                first,
                                second,
                                third
                        )
                );

        Map<String, Object> analytics =
                usageController.getAnalytics();

        @SuppressWarnings("unchecked")
        Map<String, Long> endpointCounts =
                (Map<String, Long>)
                        analytics.get("endpointCounts");

        @SuppressWarnings("unchecked")
        Map<String, Long> statusCounts =
                (Map<String, Long>)
                        analytics.get("statusCounts");

        assertEquals(
                2L,
                endpointCounts.get("/api/users")
        );

        assertEquals(
                1L,
                endpointCounts.get("/api/orders")
        );

        assertEquals(
                2L,
                statusCounts.get("200")
        );

        assertEquals(
                1L,
                statusCounts.get("401")
        );
    }

    // =====================================================
    // EMPTY DATA TEST
    // =====================================================

    @Test
    void statsShouldReturnZeroWhenNoUsageExists() {

        when(apiUsageRepository.findAll())
                .thenReturn(List.of());

        Map<String, Long> stats =
                usageController.getStats();

        assertEquals(
                0L,
                stats.get("totalRequests")
        );

        assertEquals(
                0L,
                stats.get("successfulRequests")
        );

        assertEquals(
                0L,
                stats.get("blockedRequests")
        );

        assertEquals(
                0L,
                stats.get("unauthorizedRequests")
        );

        assertEquals(
                0L,
                stats.get("rateLimitedRequests")
        );
    }

    // =====================================================
    // EMPTY ANALYTICS TEST
    // =====================================================

    @Test
    void analyticsShouldReturnEmptyMapsWhenNoUsageExists() {

        when(apiUsageRepository.findAll())
                .thenReturn(List.of());

        Map<String, Object> analytics =
                usageController.getAnalytics();

        @SuppressWarnings("unchecked")
        Map<String, Long> endpointCounts =
                (Map<String, Long>)
                        analytics.get("endpointCounts");

        @SuppressWarnings("unchecked")
        Map<String, Long> statusCounts =
                (Map<String, Long>)
                        analytics.get("statusCounts");

        assertTrue(endpointCounts.isEmpty());
        assertTrue(statusCounts.isEmpty());
    }
}