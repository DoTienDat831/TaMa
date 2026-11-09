package com.example.tama.task.dto;

import com.example.tama.entity.TaskPriority;
import com.example.tama.entity.TaskStatus;

import java.time.Instant;
import java.util.UUID;

public record TaskResponse(UUID id, UUID workspaceId, UUID projectId, String projectName,
                           String title, String description, Instant dueAt, TaskStatus status,
                           TaskPriority priority, String color, UUID createdByUserId,
                           UUID assigneeId, Instant completedAt, Instant createdAt, Instant updatedAt) { }
