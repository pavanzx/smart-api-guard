
package com.pavan.smart_api_guard.controller;

import com.pavan.smart_api_guard.entity.ApiKey;
import com.pavan.smart_api_guard.repository.ApiKeyRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/keys")
public class ApiKeyController {

    private final ApiKeyRepository apiKeyRepository;

    private final SecureRandom secureRandom = new SecureRandom();

    public ApiKeyController(ApiKeyRepository apiKeyRepository) {
        this.apiKeyRepository = apiKeyRepository;
    }

    // =====================================================
    // GET ALL API KEYS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<ApiKey>> getAllKeys() {

        List<ApiKey> keys = apiKeyRepository.findAll();

        return ResponseEntity.ok(keys);
    }

    // =====================================================
    // CREATE API KEY
    // =====================================================

    @PostMapping
    public ResponseEntity<?> createKey(
            @RequestBody Map<String, String> request) {

        String name = request.get("name");

        if (name == null || name.trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "error",
                            "API key name is required"
                    ));
        }

        String keyValue = generateUniqueApiKey();

        ApiKey apiKey = new ApiKey(
                name.trim(),
                keyValue
        );

        ApiKey savedKey = apiKeyRepository.save(apiKey);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedKey);
    }

    // =====================================================
    // ACTIVATE / DEACTIVATE API KEY
    // =====================================================

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> request) {

        Boolean active = request.get("active");

        if (active == null) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "error",
                            "active field is required"
                    ));
        }

        ApiKey apiKey = apiKeyRepository
                .findById(id)
                .orElse(null);

        if (apiKey == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error",
                            "API key not found"
                    ));
        }

        apiKey.setActive(active);

        ApiKey updatedKey =
                apiKeyRepository.save(apiKey);

        return ResponseEntity.ok(updatedKey);
    }

    // =====================================================
    // DELETE API KEY
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteKey(
            @PathVariable Long id) {

        if (!apiKeyRepository.existsById(id)) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error",
                            "API key not found"
                    ));
        }

        apiKeyRepository.deleteById(id);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "API key deleted successfully"
                )
        );
    }

    // =====================================================
    // VALIDATE API KEY
    // =====================================================

    @GetMapping("/validate")
    public ResponseEntity<?> validateKey(
            @RequestHeader(
                    value = "X-API-KEY",
                    required = false
            ) String key) {

        if (key == null || key.isBlank()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "valid",
                            false,
                            "message",
                            "API key is missing"
                    ));
        }

        ApiKey apiKey = apiKeyRepository
                .findByKeyValue(key)
                .orElse(null);

        if (apiKey == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "valid",
                            false,
                            "message",
                            "Invalid API key"
                    ));
        }

        if (!apiKey.isActive()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "valid",
                            false,
                            "message",
                            "API key is inactive"
                    ));
        }

        return ResponseEntity.ok(
                Map.of(
                        "valid",
                        true,
                        "message",
                        "API key is valid",
                        "name",
                        apiKey.getName()
                )
        );
    }

    // =====================================================
    // GENERATE UNIQUE API KEY
    // =====================================================

    private String generateUniqueApiKey() {

        String key;

        do {
            key = generateApiKey();

        } while (
                apiKeyRepository
                        .findByKeyValue(key)
                        .isPresent()
        );

        return key;
    }

    // =====================================================
    // GENERATE API KEY
    // =====================================================

    private String generateApiKey() {

        String characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                        + "abcdefghijklmnopqrstuvwxyz"
                        + "0123456789";

        StringBuilder key =
                new StringBuilder("SAG-");

        for (int i = 0; i < 32; i++) {

            int index =
                    secureRandom.nextInt(
                            characters.length()
                    );

            key.append(
                    characters.charAt(index)
            );
        }

        return key.toString();
    }
}