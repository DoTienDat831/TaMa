package com.example.tama.project.dto;

import java.util.UUID;

public record CreateProjectRequest(UUID workspaceId, UUID createdByUserId,
                                   String name, String description, String color) { }
