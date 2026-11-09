package com.example.tama.task.dto;

import com.example.tama.entity.TaskPriority;
import com.example.tama.entity.TaskStatus;

import java.time.Instant;
import java.util.UUID;

public record UpdateTaskRequest(String title, String description, Instant dueAt,
                                TaskStatus status, TaskPriority priority, UUID projectId,
                                UUID assigneeId, String color) { }
