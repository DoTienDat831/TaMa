package com.example.tama.workspace.dto;

import java.util.UUID;

public record CreateWorkspaceRequest(String name, UUID createdByUserId) { }
