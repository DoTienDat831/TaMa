package com.example.tama.task.dto;

import com.example.tama.entity.TaskPriority;

import java.time.Instant;
import java.util.UUID;

public record CreateTaskRequest(UUID workspaceId, UUID projectId, UUID createdByUserId,
                                UUID assigneeId, String title, String description,
                                Instant dueAt, TaskPriority priority, String color) { }
