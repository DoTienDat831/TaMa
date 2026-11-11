package com.example.tama.health.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
public class HealthController {

    @GetMapping("/health")
    public HealthResponse health() {
        return new HealthResponse("UP", "tama", Instant.now());
    }

    public record HealthResponse(String status, String application, Instant timestamp) { }
}
