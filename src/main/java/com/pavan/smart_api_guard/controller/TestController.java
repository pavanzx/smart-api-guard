package com.pavan.smart_api_guard.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping
    public Map<String, Object> test() {

        return Map.of(
                "message", "Smart API Guard protected API is working!",
                "status", "success"
        );
    }
}