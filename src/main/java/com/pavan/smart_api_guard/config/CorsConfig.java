package com.pavan.smart_api_guard.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        // =====================================================
        // FRONTEND ORIGINS
        // =====================================================

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5178",
                        "http://localhost:5173"
                )
        );

        // =====================================================
        // HTTP METHODS
        // =====================================================

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        // =====================================================
        // REQUEST HEADERS
        // =====================================================

        configuration.setAllowedHeaders(
                List.of(
                        "X-API-KEY",
                        "Content-Type",
                        "Accept"
                )
        );

        // =====================================================
        // RESPONSE HEADERS
        // =====================================================

        configuration.setExposedHeaders(
                List.of(
                        "X-RateLimit-Limit",
                        "X-RateLimit-Remaining",
                        "X-API-Tier"
                )
        );

        // =====================================================
        // CREDENTIALS
        // =====================================================

        configuration.setAllowCredentials(false);

        // =====================================================
        // CACHE PREFLIGHT
        // =====================================================

        configuration.setMaxAge(3600L);

        // =====================================================
        // APPLY TO ALL API ROUTES
        // =====================================================

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}