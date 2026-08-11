package com.pavan.smart_api_guard.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/demo")
public class DemoController {

    @GetMapping("/products")
    public List<Map<String, Object>> getProducts() {

        return List.of(
                Map.of(
                        "id", 1,
                        "name", "Laptop",
                        "price", 75000
                ),
                Map.of(
                        "id", 2,
                        "name", "Smartphone",
                        "price", 35000
                ),
                Map.of(
                        "id", 3,
                        "name", "Headphones",
                        "price", 5000
                )
        );
    }
}