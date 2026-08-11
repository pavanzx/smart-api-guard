package com.pavan.smart_api_guard.controller;

import com.pavan.smart_api_guard.entity.ApiUsage;
import com.pavan.smart_api_guard.repository.ApiUsageRepository;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usage")
public class UsageController {

    private final ApiUsageRepository apiUsageRepository;

    public UsageController(ApiUsageRepository apiUsageRepository) {
        this.apiUsageRepository = apiUsageRepository;
    }

    // =========================================
    // STATS
    // =========================================

    @GetMapping("/stats")
    public Map<String, Long> getStats() {

        List<ApiUsage> usages =
                apiUsageRepository.findAll();

        long totalRequests =
                usages.size();

        long successfulRequests =
                usages.stream()
                        .filter(ApiUsage::isAllowed)
                        .count();

        long blockedRequests =
                usages.stream()
                        .filter(usage -> !usage.isAllowed())
                        .count();

        long unauthorizedRequests =
                usages.stream()
                        .filter(usage ->
                                usage.getHttpStatus() == 401)
                        .count();

        long rateLimitedRequests =
                usages.stream()
                        .filter(usage ->
                                usage.getHttpStatus() == 429)
                        .count();

        Map<String, Long> stats =
                new HashMap<>();

        stats.put(
                "totalRequests",
                totalRequests
        );

        stats.put(
                "successfulRequests",
                successfulRequests
        );

        stats.put(
                "blockedRequests",
                blockedRequests
        );

        stats.put(
                "unauthorizedRequests",
                unauthorizedRequests
        );

        stats.put(
                "rateLimitedRequests",
                rateLimitedRequests
        );

        return stats;
    }

    // =========================================
    // RECENT USAGE
    // =========================================

    @GetMapping("/recent")
    public List<Map<String, Object>> getRecentUsage() {

        List<ApiUsage> usages =
                apiUsageRepository
                        .findTop20ByOrderByCreatedAtDesc();

        return usages.stream()
                .map(usage -> {

                    Map<String, Object> data =
                            new HashMap<>();

                    data.put(
                            "id",
                            usage.getId()
                    );

                    // Added because the React dashboard
                    // displays the API key.
                    data.put(
                            "apiKey",
                            usage.getApiKey()
                    );

                    data.put(
                            "endpoint",
                            usage.getEndpoint()
                    );

                    data.put(
                            "httpStatus",
                            usage.getHttpStatus()
                    );

                    data.put(
                            "allowed",
                            usage.isAllowed()
                    );

                    data.put(
                            "createdAt",
                            usage.getCreatedAt()
                    );

                    return data;
                })
                .collect(Collectors.toList());
    }

    // =========================================
    // ANALYTICS
    // =========================================

    @GetMapping("/analytics")
    public Map<String, Object> getAnalytics() {

        List<ApiUsage> usages =
                apiUsageRepository.findAll();

        Map<String, Long> endpointCounts =
                new HashMap<>();

        Map<String, Long> statusCounts =
                new HashMap<>();

        for (ApiUsage usage : usages) {

            endpointCounts.merge(
                    usage.getEndpoint(),
                    1L,
                    Long::sum
            );

            String status =
                    String.valueOf(
                            usage.getHttpStatus()
                    );

            statusCounts.merge(
                    status,
                    1L,
                    Long::sum
            );
        }

        Map<String, Object> analytics =
                new HashMap<>();

        analytics.put(
                "endpointCounts",
                endpointCounts
        );

        analytics.put(
                "statusCounts",
                statusCounts
        );

        return analytics;
    }
}
