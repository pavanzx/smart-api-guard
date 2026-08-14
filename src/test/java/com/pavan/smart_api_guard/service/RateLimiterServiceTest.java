package com.pavan.smart_api_guard.service;

import com.pavan.smart_api_guard.entity.ApiKey;
import com.pavan.smart_api_guard.repository.ApiKeyRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RateLimiterServiceTest {

    private ApiKeyRepository apiKeyRepository;
    private RateLimiterService rateLimiterService;

    @BeforeEach
    void setUp() {

        apiKeyRepository = mock(ApiKeyRepository.class);

        rateLimiterService =
                new RateLimiterService(apiKeyRepository);
    }

    @Test
    void validApiKeyShouldBeAllowed() {

        ApiKey apiKey =
                new ApiKey(
                        "Test App",
                        "TEST-KEY"
                );

        when(apiKeyRepository
                .findByKeyValueAndActiveTrue("TEST-KEY"))
                .thenReturn(Optional.of(apiKey));

        RateLimiterService.RateLimitResult result =
                rateLimiterService.checkRequest("TEST-KEY");

        assertTrue(result.allowed());
        assertEquals(10, result.limit());
        assertEquals(9, result.remaining());
        assertEquals("FREE", result.tier());
    }

    @Test
    void invalidApiKeyShouldBeRejected() {

        when(apiKeyRepository
                .findByKeyValueAndActiveTrue("WRONG-KEY"))
                .thenReturn(Optional.empty());

        RateLimiterService.RateLimitResult result =
                rateLimiterService.checkRequest("WRONG-KEY");

        assertFalse(result.allowed());
        assertEquals(0, result.limit());
        assertEquals(0, result.remaining());
        assertEquals("UNKNOWN", result.tier());
    }

    @Test
    void inactiveApiKeyShouldBeRejected() {

        when(apiKeyRepository
                .findByKeyValueAndActiveTrue("INACTIVE-KEY"))
                .thenReturn(Optional.empty());

        RateLimiterService.RateLimitResult result =
                rateLimiterService.checkRequest("INACTIVE-KEY");

        assertFalse(result.allowed());
        assertEquals("UNKNOWN", result.tier());
    }

    @Test
    void rateLimitShouldEventuallyBeExceeded() {

        ApiKey apiKey =
                new ApiKey(
                        "Test App",
                        "TEST-KEY"
                );

        apiKey.setRateLimit(3);

        when(apiKeyRepository
                .findByKeyValueAndActiveTrue("TEST-KEY"))
                .thenReturn(Optional.of(apiKey));

        RateLimiterService.RateLimitResult first =
                rateLimiterService.checkRequest("TEST-KEY");

        RateLimiterService.RateLimitResult second =
                rateLimiterService.checkRequest("TEST-KEY");

        RateLimiterService.RateLimitResult third =
                rateLimiterService.checkRequest("TEST-KEY");

        RateLimiterService.RateLimitResult fourth =
                rateLimiterService.checkRequest("TEST-KEY");

        assertTrue(first.allowed());
        assertTrue(second.allowed());
        assertTrue(third.allowed());

        assertFalse(fourth.allowed());
        assertEquals(0, fourth.remaining());
    }

    @Test
    void proApiKeyShouldReturnProTier() {

        ApiKey apiKey =
                new ApiKey(
                        "Pro App",
                        "PRO-KEY",
                        "PRO",
                        100
                );

        when(apiKeyRepository
                .findByKeyValueAndActiveTrue("PRO-KEY"))
                .thenReturn(Optional.of(apiKey));

        RateLimiterService.RateLimitResult result =
                rateLimiterService.checkRequest("PRO-KEY");

        assertTrue(result.allowed());
        assertEquals(100, result.limit());
        assertEquals(99, result.remaining());
        assertEquals("PRO", result.tier());
    }
}