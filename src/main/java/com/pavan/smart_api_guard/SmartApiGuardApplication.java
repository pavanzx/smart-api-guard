package com.pavan.smart_api_guard;

import com.pavan.smart_api_guard.filter.RateLimitFilter;
import com.pavan.smart_api_guard.service.ApiUsageService;
import com.pavan.smart_api_guard.service.RateLimiterService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SmartApiGuardApplication {

    public static void main(String[] args) {
        SpringApplication.run(
                SmartApiGuardApplication.class,
                args
        );
    }

    @Bean
    public FilterRegistrationBean<RateLimitFilter> rateLimitFilter(
            RateLimiterService rateLimiterService,
            ApiUsageService apiUsageService) {

        FilterRegistrationBean<RateLimitFilter> registration =
                new FilterRegistrationBean<>();

        registration.setFilter(
                new RateLimitFilter(
                        rateLimiterService,
                        apiUsageService
                )
        );

        registration.addUrlPatterns("/*");

        return registration;
    }
}