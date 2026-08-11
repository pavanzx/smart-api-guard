package com.pavan.smart_api_guard.service;

import com.pavan.smart_api_guard.entity.ApiKey;
import com.pavan.smart_api_guard.repository.ApiKeyRepository;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimiterService {

    private static final long REFILL_INTERVAL_MS = 1000;

    private final Map<String, ClientBucket> buckets =
            new ConcurrentHashMap<>();

    private final ApiKeyRepository apiKeyRepository;

    public RateLimiterService(
            ApiKeyRepository apiKeyRepository) {

        this.apiKeyRepository = apiKeyRepository;
    }

    public RateLimitResult checkRequest(String clientId) {

        // Find active API key
        ApiKey apiKey =
                apiKeyRepository
                .findByKeyValueAndActiveTrue(clientId)                     
                 .orElse(null);

        // Unknown or inactive API key
        if (apiKey == null) {

            return new RateLimitResult(
                    false,
                    0,
                    0,
                    "UNKNOWN"
            );
        }

        int limit =
                apiKey.getRateLimit();

        String tier =
                apiKey.getTier();

        ClientBucket bucket =
                buckets.computeIfAbsent(
                        clientId,
                        key -> new ClientBucket(limit)
                );

        return bucket.tryConsume(tier);
    }

    private static class ClientBucket {

        private int tokens;

        private long lastRefillTime;

        private final int maxTokens;

        public ClientBucket(int maxTokens) {

            this.maxTokens = maxTokens;
            this.tokens = maxTokens;

            this.lastRefillTime =
                    System.currentTimeMillis();
        }

        public synchronized RateLimitResult tryConsume(
                String tier) {

            refillTokens();

            if (tokens > 0) {

                tokens--;

                return new RateLimitResult(
                        true,
                        maxTokens,
                        tokens,
                        tier
                );
            }

            return new RateLimitResult(
                    false,
                    maxTokens,
                    0,
                    tier
            );
        }

        private void refillTokens() {

            long currentTime =
                    System.currentTimeMillis();

            long elapsedTime =
                    currentTime - lastRefillTime;

            if (elapsedTime >= REFILL_INTERVAL_MS) {

                long tokensToAdd =
                        elapsedTime /
                        REFILL_INTERVAL_MS;

                tokens = (int) Math.min(
                        maxTokens,
                        tokens + tokensToAdd
                );

                lastRefillTime +=
                        tokensToAdd *
                        REFILL_INTERVAL_MS;
            }
        }
    }

    public record RateLimitResult(
            boolean allowed,
            int limit,
            int remaining,
            String tier
    ) {
    }
}