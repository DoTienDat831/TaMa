package com.example.tama.project.dto;

import com.example.tama.entity.ProjectStatus;

import java.time.Instant;
import java.util.UUID;

public record ProjectResponse(UUID id, UUID workspaceId, String name, String description,
                              String color, ProjectStatus status, Instant createdAt, Instant updatedAt) { }
