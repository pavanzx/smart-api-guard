package com.pavan.smart_api_guard.repository;

import com.pavan.smart_api_guard.entity.ApiUsage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApiUsageRepository
        extends JpaRepository<ApiUsage, Long> {

    List<ApiUsage> findTop20ByOrderByCreatedAtDesc();
}