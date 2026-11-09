package com.example.tama.project.service;

import com.example.tama.common.exception.BadRequestException;
import com.example.tama.common.exception.ResourceNotFoundException;
import com.example.tama.entity.Project;
import com.example.tama.entity.ProjectStatus;
import com.example.tama.entity.User;
import com.example.tama.entity.Workspace;
import com.example.tama.project.dto.CreateProjectRequest;
import com.example.tama.project.dto.ProjectResponse;
import com.example.tama.project.dto.UpdateProjectRequest;
import com.example.tama.project.repository.ProjectRepository;
import com.example.tama.user.repository.UserRepository;
import com.example.tama.workspace.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class ProjectService {
    private final ProjectRepository projects;
    private final WorkspaceRepository workspaces;
    private final UserRepository users;

    public ProjectService(ProjectRepository projects, WorkspaceRepository workspaces, UserRepository users) {
        this.projects = projects;
        this.workspaces = workspaces;
        this.users = users;
    }

    @Transactional
    public ProjectResponse create(CreateProjectRequest request) {
        requireText(request.name(), "Project name is required");
        Workspace workspace = workspaces.findById(request.workspaceId())
                .orElseThrow(() -> new ResourceNotFoundException("Workspace", request.workspaceId()));
        User creator = users.findById(request.createdByUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", request.createdByUserId()));
        Project project = new Project();
        project.setWorkspace(workspace);
        project.setCreatedBy(creator);
        project.setName(request.name().trim());
        project.setDescription(request.description());
        project.setColor(request.color());
        project.setStatus(ProjectStatus.ACTIVE);
        return toResponse(projects.save(project));
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> findByWorkspace(UUID workspaceId) {
        return projects.findByWorkspaceIdAndArchivedAtIsNullOrderByName(workspaceId)
                .stream().map(ProjectService::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponse findById(UUID id) {
        return toResponse(getProject(id));
    }

    @Transactional
    public ProjectResponse update(UUID id, UpdateProjectRequest request) {
        Project project = getProject(id);
        if (request.name() != null) {
            requireText(request.name(), "Project name cannot be blank");
            project.setName(request.name().trim());
        }
        if (request.description() != null) project.setDescription(request.description());
        if (request.color() != null) project.setColor(request.color());
        if (request.status() != null) {
            project.setStatus(request.status());
            project.setArchivedAt(request.status() == ProjectStatus.ARCHIVED ? Instant.now() : null);
        }
        return toResponse(projects.save(project));
    }

    @Transactional
    public void delete(UUID id) {
        Project project = getProject(id);
        project.setStatus(ProjectStatus.ARCHIVED);
        project.setArchivedAt(Instant.now());
        projects.save(project);
    }

    private Project getProject(UUID id) {
        return projects.findById(id).orElseThrow(() -> new ResourceNotFoundException("Project", id));
    }

    private static void requireText(String value, String message) {
        if (value == null || value.isBlank()) throw new BadRequestException(message);
    }

    private static ProjectResponse toResponse(Project p) {
        return new ProjectResponse(p.getId(), p.getWorkspace().getId(), p.getName(), p.getDescription(),
                p.getColor(), p.getStatus(), p.getCreatedAt(), p.getUpdatedAt());
    }
}
