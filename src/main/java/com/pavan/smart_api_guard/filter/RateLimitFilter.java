package com.pavan.smart_api_guard.filter;

import com.pavan.smart_api_guard.service.ApiUsageService;
import com.pavan.smart_api_guard.service.RateLimiterService;
import com.pavan.smart_api_guard.service.RateLimiterService.RateLimitResult;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimiterService rateLimiterService;
    private final ApiUsageService apiUsageService;

    public RateLimitFilter(
            RateLimiterService rateLimiterService,
            ApiUsageService apiUsageService) {

        this.rateLimiterService = rateLimiterService;
        this.apiUsageService = apiUsageService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // =========================================
        // CORS
        // =========================================

        response.setHeader(
                "Access-Control-Allow-Origin",
                "http://localhost:5173"
        );

        response.setHeader(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS"
        );

        response.setHeader(
                "Access-Control-Allow-Headers",
                "X-API-KEY, Content-Type"
        );

        response.setHeader(
                "Access-Control-Expose-Headers",
                "X-RateLimit-Limit, X-RateLimit-Remaining, X-API-Tier"
        );

        // =========================================
        // CORS PREFLIGHT
        // =========================================

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {

            response.setStatus(
                    HttpServletResponse.SC_OK
            );

            return;
        }

        String endpoint =
                request.getRequestURI();

        String method =
                request.getMethod();

        // =========================================
        // ALLOW API KEY CREATION
        // =========================================
        //
        // The first API key cannot be created if
        // this endpoint itself requires an API key.
        //
        // Therefore:
        //
        // POST /api/keys
        //
        // bypasses authentication.
        //

        if ("/api/keys".equals(endpoint)
                && "POST".equalsIgnoreCase(method)) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        // =========================================
        // API KEY
        // =========================================

        String apiKey =
                request.getHeader("X-API-KEY");

        // =========================================
        // MISSING API KEY
        // =========================================

        if (apiKey == null || apiKey.isBlank()) {

            apiUsageService.logRequest(
                    "UNKNOWN",
                    endpoint,
                    401,
                    false
            );

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.setContentType(
                    "text/plain;charset=UTF-8"
            );

            response.getWriter().write(
                    "Missing API key."
            );

            return;
        }

        // =========================================
        // CHECK RATE LIMIT
        // =========================================

        RateLimitResult result =
                rateLimiterService.checkRequest(
                        apiKey
                );

        // =========================================
        // UNKNOWN / INVALID API KEY
        // =========================================

        if ("UNKNOWN".equals(result.tier())) {

            apiUsageService.logRequest(
                    apiKey,
                    endpoint,
                    401,
                    false
            );

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.setContentType(
                    "text/plain;charset=UTF-8"
            );

            response.getWriter().write(
                    "Invalid API key."
            );

            return;
        }

        // =========================================
        // RATE LIMIT HEADERS
        // =========================================

        response.setHeader(
                "X-RateLimit-Limit",
                String.valueOf(
                        result.limit()
                )
        );

        response.setHeader(
                "X-RateLimit-Remaining",
                String.valueOf(
                        result.remaining()
                )
        );

        response.setHeader(
                "X-API-Tier",
                result.tier()
        );

        // =========================================
        // RATE LIMIT EXCEEDED
        // =========================================

        if (!result.allowed()) {

            apiUsageService.logRequest(
                    apiKey,
                    endpoint,
                    429,
                    false
            );

            // Do NOT use SC_TOO_MANY_REQUESTS.
            // It is not available in your Servlet version.
            response.setStatus(429);

            response.setContentType(
                    "text/plain;charset=UTF-8"
            );

            response.getWriter().write(
                    "Rate limit exceeded. Try again later."
            );

            return;
        }

        // =========================================
        // REQUEST ALLOWED
        // =========================================

        apiUsageService.logRequest(
                apiKey,
                endpoint,
                200,
                true
        );

        filterChain.doFilter(
                request,
                response
        );
    }
}
