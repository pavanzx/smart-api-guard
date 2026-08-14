package com.pavan.smart_api_guard.service;

import com.pavan.smart_api_guard.entity.ApiKey;
import com.pavan.smart_api_guard.repository.ApiKeyRepository;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimiterService {

    // =====================================================
    // RATE LIMIT WINDOW
    // =====================================================

    /*
     * One rate-limit window = 60 seconds.
     *
     * FREE example:
     *
     *     rateLimit = 10
     *     10 requests per minute
     *
     * PRO example:
     *
     *     rateLimit = 100
     *     100 requests per minute
     */
    private static final long WINDOW_SIZE_MS =
            60_000L;

    /*
     * One bucket for each API key.
     */
    private final Map<String, ClientBucket> buckets =
            new ConcurrentHashMap<>();

    private final ApiKeyRepository apiKeyRepository;

    public RateLimiterService(
            ApiKeyRepository apiKeyRepository) {

        this.apiKeyRepository = apiKeyRepository;
    }

    // =====================================================
    // CHECK REQUEST
    // =====================================================

    public RateLimitResult checkRequest(
            String clientId) {

        // -------------------------------------------------
        // Find ACTIVE API key
        // -------------------------------------------------

        ApiKey apiKey =
                apiKeyRepository
                        .findByKeyValueAndActiveTrue(clientId)
                        .orElse(null);

        // -------------------------------------------------
        // UNKNOWN / INACTIVE API KEY
        // -------------------------------------------------

        if (apiKey == null) {

            return new RateLimitResult(
                    false,
                    0,
                    0,
                    "UNKNOWN"
            );
        }

        // -------------------------------------------------
        // CURRENT DATABASE CONFIGURATION
        // -------------------------------------------------

        int limit =
                Math.max(
                        apiKey.getRateLimit(),
                        1
                );

        String tier =
                apiKey.getTier();

        // -------------------------------------------------
        // CREATE OR UPDATE BUCKET
        // -------------------------------------------------

        ClientBucket bucket =
                buckets.compute(
                        clientId,
                        (key, existingBucket) -> {

                            // No bucket yet.
                            if (existingBucket == null) {

                                return new ClientBucket(
                                        limit
                                );
                            }

                            /*
                             * If rate_limit was changed in MySQL,
                             * immediately create a new bucket.
                             */
                            if (existingBucket.getLimit()
                                    != limit) {

                                return new ClientBucket(
                                        limit
                                );
                            }

                            return existingBucket;
                        }
                );

        // -------------------------------------------------
        // CHECK / CONSUME REQUEST
        // -------------------------------------------------

        return bucket.tryConsume(tier);
    }

    // =====================================================
    // CLIENT BUCKET
    // =====================================================

    private static class ClientBucket {

        /*
         * Maximum number of requests allowed
         * during the current window.
         */
        private final int limit;

        /*
         * Number of requests already used.
         */
        private int requestCount;

        /*
         * Start time of the current window.
         */
        private long windowStart;

        // -------------------------------------------------
        // CONSTRUCTOR
        // -------------------------------------------------

        public ClientBucket(int limit) {

            this.limit = Math.max(
                    limit,
                    1
            );

            this.requestCount = 0;

            this.windowStart =
                    System.currentTimeMillis();
        }

        // -------------------------------------------------
        // GET LIMIT
        // -------------------------------------------------

        public int getLimit() {

            return limit;
        }

        // -------------------------------------------------
        // TRY CONSUME
        // -------------------------------------------------

        public synchronized RateLimitResult tryConsume(
                String tier) {

            long currentTime =
                    System.currentTimeMillis();

            // -------------------------------------------------
            // CHECK WHETHER CURRENT WINDOW EXPIRED
            // -------------------------------------------------

            if (currentTime - windowStart
                    >= WINDOW_SIZE_MS) {

                /*
                 * Start a completely new window.
                 */
                windowStart = currentTime;

                requestCount = 0;
            }

            // -------------------------------------------------
            // CALCULATE REMAINING REQUESTS
            // -------------------------------------------------

            int remaining =
                    Math.max(
                            limit - requestCount,
                            0
                    );

            // -------------------------------------------------
            // RATE LIMIT EXCEEDED
            // -------------------------------------------------

            if (requestCount >= limit) {

                return new RateLimitResult(
                        false,
                        limit,
                        0,
                        tier
                );
            }

            // -------------------------------------------------
            // ALLOW REQUEST
            // -------------------------------------------------

            requestCount++;

            remaining =
                    Math.max(
                            limit - requestCount,
                            0
                    );

            return new RateLimitResult(
                    true,
                    limit,
                    remaining,
                    tier
            );
        }
    }

    // =====================================================
    // RATE LIMIT RESULT
    // =====================================================

    public record RateLimitResult(
            boolean allowed,
            int limit,
            int remaining,
            String tier
    ) {
    }
}