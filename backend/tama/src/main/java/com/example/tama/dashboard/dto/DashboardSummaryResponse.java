package com.example.tama.dashboard.dto;

public record DashboardSummaryResponse(long totalTasks, long completedTasks,
                                       long openTasks, long tasksDueInRange) { }
