package com.example.tama.project.dto;

import com.example.tama.entity.ProjectStatus;

public record UpdateProjectRequest(String name, String description, String color, ProjectStatus status) { }
