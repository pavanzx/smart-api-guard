package com.pavan.smart_api_guard.controller;

import com.pavan.smart_api_guard.entity.ApiKey;
import com.pavan.smart_api_guard.service.ApiKeyService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/keys")
public class ApiKeyController {

    private final ApiKeyService apiKeyService;

    public ApiKeyController(ApiKeyService apiKeyService) {
        this.apiKeyService = apiKeyService;
    }

    @GetMapping
    public ResponseEntity<List<ApiKey>> getAllKeys() {
        return ResponseEntity.ok(apiKeyService.getAllApiKeys());
    }

    @PostMapping
    public ResponseEntity<?> createKey(
            @RequestBody Map<String, Object> request) {

        try {
            String name = (String) request.get("name");

            String tier = (String) request.get("tier");

            Integer rateLimit = null;

            Object rateLimitObject = request.get("rateLimit");

            if (rateLimitObject instanceof Number) {
                rateLimit = ((Number) rateLimitObject).intValue();
            }

            ApiKey savedKey =
                    apiKeyService.createApiKey(
                            name,
                            tier,
                            rateLimit
                    );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedKey);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }

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

        try {
            ApiKey apiKey = apiKeyService.getApiKey(id);

            apiKey.setActive(active);

            return ResponseEntity.ok(apiKey);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteKey(
            @PathVariable Long id) {

        try {
            ApiKey apiKey = apiKeyService.getApiKey(id);

            apiKey.setActive(false);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "API key deleted successfully"
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }

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
                            "valid", false,
                            "message", "API key is missing"
                    ));
        }

return ResponseEntity.ok(
        apiKeyService.validateKey(key));    }
}