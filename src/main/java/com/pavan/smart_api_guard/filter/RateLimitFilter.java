package com.pavan.smart_api_guard.filter;

import com.pavan.smart_api_guard.service.ApiUsageService;
import com.pavan.smart_api_guard.service.RateLimiterService;
import com.pavan.smart_api_guard.service.RateLimiterService.RateLimitResult;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletResponseWrapper;

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

        // =====================================================
        // CORS
        // =====================================================

        String origin = request.getHeader("Origin");

        if ("http://localhost:5178".equals(origin)
                || "http://localhost:5173".equals(origin)) {

            response.setHeader(
                    "Access-Control-Allow-Origin",
                    origin
            );
        }

        response.setHeader(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS"
        );

        response.setHeader(
                "Access-Control-Allow-Headers",
                "X-API-KEY, Content-Type, Accept"
        );

        response.setHeader(
                "Access-Control-Expose-Headers",
                "X-RateLimit-Limit, X-RateLimit-Remaining, X-API-Tier"
        );

        response.setHeader(
                "Vary",
                "Origin"
        );

        // =====================================================
        // CORS PREFLIGHT
        // =====================================================

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {

            response.setStatus(
                    HttpServletResponse.SC_OK
            );

            return;
        }
        // =====================================================
// ALLOW FRONTEND
// =====================================================

String path = request.getRequestURI();

if (path.equals("/")
        || path.startsWith("/assets/")
        || path.equals("/favicon.ico")
        || path.endsWith(".js")
        || path.endsWith(".css")
        || path.endsWith(".png")
        || path.endsWith(".jpg")
        || path.endsWith(".jpeg")
        || path.endsWith(".svg")
        || path.endsWith(".ico")) {

    filterChain.doFilter(request, response);
    return;
}

        // =====================================================
        // REQUEST INFORMATION
        // =====================================================

        String endpoint =
                request.getRequestURI();

        String method =
                request.getMethod();

                // =====================================================
// ALLOW FRONTEND FILES WITHOUT API KEY
// =====================================================

if (endpoint.equals("/")
        || endpoint.startsWith("/assets/")
        || endpoint.equals("/favicon.ico")) {

    filterChain.doFilter(request, response);
    return;
}

        // =====================================================
        // CREATE API KEY
        // =====================================================
        //
        // POST /api/keys does not require an API key.
        //
        // However, we still capture the actual response status
        // so 200 / 201 / 400 / 409 / 500 etc. are logged.
        //

        if ("/api/keys".equals(endpoint)
                && "POST".equalsIgnoreCase(method)) {

            StatusCaptureResponseWrapper wrappedResponse =
                    new StatusCaptureResponseWrapper(response);

            try {

                filterChain.doFilter(
                        request,
                        wrappedResponse
                );

            } finally {

                int finalStatus =
                        wrappedResponse.getStatus();

                boolean allowed =
                        finalStatus >= 200
                                && finalStatus < 400;

                apiUsageService.logRequest(
                        "PUBLIC",
                        endpoint,
                        finalStatus,
                        allowed
                );
            }

            return;
        }

        // =====================================================
        // VALIDATE API KEY
        // =====================================================
        //
        // GET /api/keys/validate is handled directly by the
        // controller.
        //
        // We do NOT apply rate limiting here.
        //
        // But we DO capture the actual response status.
        //

        if ("/api/keys/validate".equals(endpoint)
                && "GET".equalsIgnoreCase(method)) {

            String validationKey =
                    request.getHeader("X-API-KEY");

            String usageKey =
                    (validationKey == null
                            || validationKey.isBlank())
                            ? "UNKNOWN"
                            : validationKey;

            StatusCaptureResponseWrapper wrappedResponse =
                    new StatusCaptureResponseWrapper(response);

            try {

                filterChain.doFilter(
                        request,
                        wrappedResponse
                );

            } finally {

                int finalStatus =
                        wrappedResponse.getStatus();

                boolean allowed =
                        finalStatus >= 200
                                && finalStatus < 400;

                apiUsageService.logRequest(
                        usageKey,
                        endpoint,
                        finalStatus,
                        allowed
                );
            }

            return;
        }
// =====================================================
// FRONTEND STATIC FILES
// =====================================================

String uri = request.getRequestURI();

if ("/".equals(uri)
        || "/index.html".equals(uri)
        || uri.startsWith("/assets/")
        || uri.startsWith("/favicon")) {

    filterChain.doFilter(request, response);
    return;
}
        // =====================================================
        // READ API KEY
        // =====================================================

        String apiKey =
                request.getHeader("X-API-KEY");

        // =====================================================
        // MISSING API KEY
        // =====================================================

        if (apiKey == null || apiKey.isBlank()) {

            apiUsageService.logRequest(
                    "UNKNOWN",
                    endpoint,
                    HttpServletResponse.SC_UNAUTHORIZED,
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

        // =====================================================
        // RATE LIMIT CHECK
        // =====================================================

        RateLimitResult result =
                rateLimiterService.checkRequest(
                        apiKey
                );

        // =====================================================
        // INVALID API KEY
        // =====================================================

        if ("UNKNOWN".equals(result.tier())) {

            apiUsageService.logRequest(
                    apiKey,
                    endpoint,
                    HttpServletResponse.SC_UNAUTHORIZED,
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

        // =====================================================
        // RATE LIMIT HEADERS
        // =====================================================

        response.setHeader(
                "X-RateLimit-Limit",
                String.valueOf(result.limit())
        );

        response.setHeader(
                "X-RateLimit-Remaining",
                String.valueOf(result.remaining())
        );

        response.setHeader(
                "X-API-Tier",
                result.tier()
        );

        // =====================================================
        // RATE LIMIT EXCEEDED
        // =====================================================

        if (!result.allowed()) {

            apiUsageService.logRequest(
                    apiKey,
                    endpoint,
                    429,
                    false
            );

            response.setStatus(429);

            response.setContentType(
                    "text/plain;charset=UTF-8"
            );

            response.getWriter().write(
                    "Rate limit exceeded. Try again later."
            );

            return;
        }

        // =====================================================
        // REQUEST ALLOWED
        // =====================================================
        //
        // Capture the actual final status returned by Spring.
        //

        StatusCaptureResponseWrapper wrappedResponse =
                new StatusCaptureResponseWrapper(response);

        try {

            filterChain.doFilter(
                    request,
                    wrappedResponse
            );

        } finally {

            int finalStatus =
                    wrappedResponse.getStatus();

            boolean allowed =
                    finalStatus >= 200
                            && finalStatus < 400;

            apiUsageService.logRequest(
                    apiKey,
                    endpoint,
                    finalStatus,
                    allowed
            );
        }
    }

    // =====================================================
    // STATUS CAPTURE RESPONSE WRAPPER
    // =====================================================

    private static class StatusCaptureResponseWrapper
            extends HttpServletResponseWrapper {

        private int httpStatus =
                HttpServletResponse.SC_OK;

        public StatusCaptureResponseWrapper(
                HttpServletResponse response) {

            super(response);
        }

        // =====================================================
        // SET STATUS
        // =====================================================

        @Override
        public void setStatus(int status) {

            this.httpStatus = status;

            super.setStatus(status);
        }

        // =====================================================
        // SEND ERROR
        // =====================================================

        @Override
        public void sendError(int status)
                throws IOException {

            this.httpStatus = status;

            super.sendError(status);
        }

        // =====================================================
        // SEND ERROR WITH MESSAGE
        // =====================================================

        @Override
        public void sendError(
                int status,
                String message)
                throws IOException {

            this.httpStatus = status;

            super.sendError(
                    status,
                    message
            );
        }

        // =====================================================
        // SEND REDIRECT
        // =====================================================

        @Override
        public void sendRedirect(
                String location)
                throws IOException {

            this.httpStatus =
                    HttpServletResponse.SC_FOUND;

            super.sendRedirect(location);
        }

        // =====================================================
        // GET STATUS
        // =====================================================

        @Override
        public int getStatus() {

            return httpStatus;
        }
    }
}
