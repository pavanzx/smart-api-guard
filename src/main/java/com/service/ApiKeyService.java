package com.pavan.smart_api_guard.service;

import com.pavan.smart_api_guard.entity.ApiKey;
import com.pavan.smart_api_guard.repository.ApiKeyRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;
import java.util.Map;

@Service
public class ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;

    private static final String CHARACTERS =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    private final SecureRandom secureRandom = new SecureRandom();

    public ApiKeyService(ApiKeyRepository apiKeyRepository) {
        this.apiKeyRepository = apiKeyRepository;
    }

    // =====================================================
    // CREATE API KEY
    // =====================================================

    public ApiKey createApiKey(
            String name,
            String tier,
            Integer rateLimit) {

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException(
                    "API key name cannot be empty"
            );
        }

        if (tier == null || tier.isBlank()) {
            tier = "FREE";
        }

        tier = tier.toUpperCase();

        if (!tier.equals("FREE") && !tier.equals("PRO")) {
            throw new IllegalArgumentException(
                    "Tier must be FREE or PRO"
            );
        }

        if (rateLimit == null || rateLimit <= 0) {
            rateLimit = tier.equals("PRO") ? 100 : 10;
        }

        String keyValue = generateUniqueKey();

        ApiKey apiKey = new ApiKey(
                name,
                keyValue,
                tier,
                rateLimit
        );

        return apiKeyRepository.save(apiKey);
    }

    // =====================================================
    // GET ALL ACTIVE API KEYS
    // =====================================================

    public List<ApiKey> getAllApiKeys() {

        return apiKeyRepository.findAll()
                .stream()
                .filter(ApiKey::isActive)
                .toList();
    }

    // =====================================================
    // GET API KEY BY ID
    // =====================================================

    public ApiKey getApiKey(Long id) {

        return apiKeyRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "API key not found"
                        )
                );
    }

    // =====================================================
    // DEACTIVATE API KEY
    // =====================================================

    public void deactivateApiKey(Long id) {

        ApiKey apiKey = getApiKey(id);

        apiKey.setActive(false);

        apiKeyRepository.save(apiKey);
    }
    // =====================================================
// VALIDATE API KEY
// =====================================================

public Map<String, Object> validateKey(String key) {

    if (key == null || key.isBlank()) {
        throw new IllegalArgumentException("API key is missing");
    }

    ApiKey apiKey = apiKeyRepository
            .findByKeyValue(key)
            .orElse(null);

    if (apiKey == null) {
        throw new IllegalArgumentException("Invalid API key");
    }

    if (!apiKey.isActive()) {
        throw new IllegalArgumentException("API key is inactive");
    }

    return Map.of(
            "valid", true,
            "message", "API key is valid",
            "name", apiKey.getName(),
            "tier", apiKey.getTier(),
            "rateLimit", apiKey.getRateLimit()
    );
}
    // =====================================================
    // GENERATE UNIQUE API KEY
    // =====================================================

    private String generateUniqueKey() {

        String key;

        do {
            key = "SAG-" + generateRandomString(32);
        }
        while (
                apiKeyRepository
                        .findByKeyValueAndActiveTrue(key)
                        .isPresent()
        );

        return key;
    }

    private String generateRandomString(int length) {

        StringBuilder result = new StringBuilder(length);

        for (int i = 0; i < length; i++) {

            int index =
                    secureRandom.nextInt(
                            CHARACTERS.length()
                    );

            result.append(
                    CHARACTERS.charAt(index)
            );
        }

        return result.toString();
    }
}