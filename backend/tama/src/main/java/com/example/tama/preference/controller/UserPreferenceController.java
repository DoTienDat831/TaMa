package com.example.tama.preference.controller;

import com.example.tama.preference.dto.UpdatePreferenceRequest;
import com.example.tama.preference.dto.UserPreferenceResponse;
import com.example.tama.preference.service.UserPreferenceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/users/{userId}/preferences")
public class UserPreferenceController {
    private final UserPreferenceService service;

    public UserPreferenceController(UserPreferenceService service) { this.service = service; }

    @GetMapping
    public UserPreferenceResponse get(@PathVariable UUID userId) { return service.get(userId); }

    @PutMapping
    public UserPreferenceResponse save(@PathVariable UUID userId, @RequestBody UpdatePreferenceRequest request) {
        return service.save(userId, request);
    }
}
