package com.pavan.smart_api_guard.filter;

import com.pavan.smart_api_guard.service.ApiUsageService;
import com.pavan.smart_api_guard.service.RateLimiterService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RateLimitFilterTest {

    private RateLimiterService rateLimiterService;
    private ApiUsageService apiUsageService;
    private RateLimitFilter filter;

    @BeforeEach
    void setUp() {

        rateLimiterService =
                mock(RateLimiterService.class);

        apiUsageService =
                mock(ApiUsageService.class);

        filter =
                new RateLimitFilter(
                        rateLimiterService,
                        apiUsageService
                );
    }

    // =========================================================
    // 1. MISSING API KEY
    // =========================================================

    @Test
    void missingApiKeyShouldReturn401()
            throws ServletException, IOException {

        HttpServletRequest request =
                mock(HttpServletRequest.class);

        HttpServletResponse response =
                mock(HttpServletResponse.class);

        FilterChain filterChain =
                mock(FilterChain.class);

        StringWriter stringWriter =
                new StringWriter();

        PrintWriter printWriter =
                new PrintWriter(stringWriter);

        when(response.getWriter())
                .thenReturn(printWriter);

        when(request.getHeader("X-API-KEY"))
                .thenReturn(null);

        when(request.getRequestURI())
                .thenReturn("/api/test");

        filter.doFilterInternal(
                request,
                response,
                filterChain
        );

        verify(response)
                .setStatus(401);

        verify(filterChain, never())
                .doFilter(request, response);

        verify(apiUsageService)
                .logRequest(
                        eq("UNKNOWN"),
                        eq("/api/test"),
                        eq(401),
                        eq(false)
                );
    }

    // =========================================================
    // 2. INVALID API KEY
    // =========================================================

    @Test
    void invalidApiKeyShouldReturn401()
            throws ServletException, IOException {

        HttpServletRequest request =
                mock(HttpServletRequest.class);

        HttpServletResponse response =
                mock(HttpServletResponse.class);

        FilterChain filterChain =
                mock(FilterChain.class);

        StringWriter stringWriter =
                new StringWriter();

        PrintWriter printWriter =
                new PrintWriter(stringWriter);

        when(response.getWriter())
                .thenReturn(printWriter);

        when(request.getHeader("X-API-KEY"))
                .thenReturn("INVALID-KEY");

        when(request.getRequestURI())
                .thenReturn("/api/test");

        when(rateLimiterService.checkRequest("INVALID-KEY"))
                .thenReturn(
                        new RateLimiterService.RateLimitResult(
                                false,
                                0,
                                0,
                                "UNKNOWN"
                        )
                );

        filter.doFilterInternal(
                request,
                response,
                filterChain
        );

        verify(response)
                .setStatus(401);

        verify(filterChain, never())
                .doFilter(request, response);

        verify(apiUsageService)
                .logRequest(
                        eq("INVALID-KEY"),
                        eq("/api/test"),
                        eq(401),
                        eq(false)
                );
    }

    // =========================================================
    // 3. VALID API KEY
    // =========================================================

    @Test
    void validApiKeyShouldContinueRequest()
            throws ServletException, IOException {

        HttpServletRequest request =
                mock(HttpServletRequest.class);

        HttpServletResponse response =
                mock(HttpServletResponse.class);

        FilterChain filterChain =
                mock(FilterChain.class);

        StringWriter stringWriter =
                new StringWriter();

        PrintWriter printWriter =
                new PrintWriter(stringWriter);

        when(response.getWriter())
                .thenReturn(printWriter);

        when(request.getHeader("X-API-KEY"))
                .thenReturn("TEST-KEY");

        when(request.getRequestURI())
                .thenReturn("/api/test");

        when(rateLimiterService.checkRequest("TEST-KEY"))
                .thenReturn(
                        new RateLimiterService.RateLimitResult(
                                true,
                                10,
                                9,
                                "FREE"
                        )
                );

        filter.doFilterInternal(
                request,
                response,
                filterChain
        );

        verify(response)
                .setHeader(
                        "X-RateLimit-Limit",
                        "10"
                );

        verify(response)
                .setHeader(
                        "X-RateLimit-Remaining",
                        "9"
                );

        verify(response)
                .setHeader(
                        "X-API-Tier",
                        "FREE"
                );
verify(filterChain)
        .doFilter(
                eq(request),
                any(HttpServletResponse.class)
        );

        verify(apiUsageService)
                .logRequest(
                        eq("TEST-KEY"),
                        eq("/api/test"),
                        eq(200),
                        eq(true)
                );
    }

    // =========================================================
    // 4. RATE LIMIT EXCEEDED
    // =========================================================

    @Test
    void rateLimitExceededShouldReturn429()
            throws ServletException, IOException {

        HttpServletRequest request =
                mock(HttpServletRequest.class);

        HttpServletResponse response =
                mock(HttpServletResponse.class);

        FilterChain filterChain =
                mock(FilterChain.class);

        StringWriter stringWriter =
                new StringWriter();

        PrintWriter printWriter =
                new PrintWriter(stringWriter);

        when(response.getWriter())
                .thenReturn(printWriter);

        when(request.getHeader("X-API-KEY"))
                .thenReturn("TEST-KEY");

        when(request.getRequestURI())
                .thenReturn("/api/test");

        when(rateLimiterService.checkRequest("TEST-KEY"))
                .thenReturn(
                        new RateLimiterService.RateLimitResult(
                                false,
                                10,
                                0,
                                "FREE"
                        )
                );

        filter.doFilterInternal(
                request,
                response,
                filterChain
        );

        verify(response)
                .setStatus(429);

        verify(filterChain, never())
                .doFilter(request, response);

        verify(apiUsageService)
                .logRequest(
                        eq("TEST-KEY"),
                        eq("/api/test"),
                        eq(429),
                        eq(false)
                );
    }

    // =========================================================
    // 5. PRO API KEY / RATE LIMIT HEADERS
    // =========================================================

    @Test
    void validProApiKeyShouldSetCorrectHeaders()
            throws ServletException, IOException {

        HttpServletRequest request =
                mock(HttpServletRequest.class);

        HttpServletResponse response =
                mock(HttpServletResponse.class);

        FilterChain filterChain =
                mock(FilterChain.class);

        StringWriter stringWriter =
                new StringWriter();

        PrintWriter printWriter =
                new PrintWriter(stringWriter);

        when(response.getWriter())
                .thenReturn(printWriter);

        when(request.getHeader("X-API-KEY"))
                .thenReturn("PRO-KEY");

        when(request.getRequestURI())
                .thenReturn("/api/test");

        when(rateLimiterService.checkRequest("PRO-KEY"))
                .thenReturn(
                        new RateLimiterService.RateLimitResult(
                                true,
                                100,
                                99,
                                "PRO"
                        )
                );

        filter.doFilterInternal(
                request,
                response,
                filterChain
        );

        verify(response)
                .setHeader(
                        "X-RateLimit-Limit",
                        "100"
                );

        verify(response)
                .setHeader(
                        "X-RateLimit-Remaining",
                        "99"
                );

        verify(response)
                .setHeader(
                        "X-API-Tier",
                        "PRO"
                );

        verify(filterChain)
        .doFilter(
                eq(request),
                any(HttpServletResponse.class)
        );

        verify(apiUsageService)
                .logRequest(
                        eq("PRO-KEY"),
                        eq("/api/test"),
                        eq(200),
                        eq(true)
                );
    }
}