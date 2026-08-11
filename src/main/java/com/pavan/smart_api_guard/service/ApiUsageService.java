package com.pavan.smart_api_guard.service;

import com.pavan.smart_api_guard.entity.ApiUsage;
import com.pavan.smart_api_guard.repository.ApiUsageRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ApiUsageService {

    private final ApiUsageRepository apiUsageRepository;

    public ApiUsageService(ApiUsageRepository apiUsageRepository) {
        this.apiUsageRepository = apiUsageRepository;
    }

    public void logRequest(
            String apiKey,
            String endpoint,
            int httpStatus,
            boolean allowed) {

        ApiUsage usage = new ApiUsage(
                apiKey,
                endpoint,
                httpStatus,
                allowed,
                LocalDateTime.now()
        );

        apiUsageRepository.save(usage);
    }
}