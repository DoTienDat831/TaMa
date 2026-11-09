package com.example.tama.preference.dto;

import java.util.UUID;

public record UserPreferenceResponse(UUID userId, boolean notificationsEnabled, boolean compactTasks, String timezone) { }
