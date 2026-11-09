package com.example.tama.preference.dto;

public record UpdatePreferenceRequest(boolean notificationsEnabled, boolean compactTasks, String timezone) { }
