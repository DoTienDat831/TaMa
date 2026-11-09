package com.example.tama.preference.service;

import com.example.tama.common.exception.ResourceNotFoundException;
import com.example.tama.entity.User;
import com.example.tama.entity.UserPreference;
import com.example.tama.preference.dto.UpdatePreferenceRequest;
import com.example.tama.preference.dto.UserPreferenceResponse;
import com.example.tama.preference.repository.UserPreferenceRepository;
import com.example.tama.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UserPreferenceService {
    private final UserPreferenceRepository preferences;
    private final UserRepository users;

    public UserPreferenceService(UserPreferenceRepository preferences, UserRepository users) {
        this.preferences = preferences;
        this.users = users;
    }

    @Transactional
    public UserPreferenceResponse get(UUID userId) {
        User user = users.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", userId));
        UserPreference preference = preferences.findByUserId(userId).orElseGet(() -> {
            UserPreference defaults = new UserPreference();
            defaults.setUser(user);
            return preferences.save(defaults);
        });
        return toResponse(preference);
    }

    @Transactional
    public UserPreferenceResponse save(UUID userId, UpdatePreferenceRequest request) {
        User user = users.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", userId));
        UserPreference preference = preferences.findByUserId(userId).orElseGet(() -> {
            UserPreference created = new UserPreference();
            created.setUser(user);
            return created;
        });
        preference.setNotificationsEnabled(request.notificationsEnabled());
        preference.setCompactTasks(request.compactTasks());
        if (request.timezone() != null && !request.timezone().isBlank()) preference.setTimezone(request.timezone());
        return toResponse(preferences.save(preference));
    }

    private static UserPreferenceResponse toResponse(UserPreference p) {
        return new UserPreferenceResponse(p.getUser().getId(), p.isNotificationsEnabled(), p.isCompactTasks(), p.getTimezone());
    }
}
