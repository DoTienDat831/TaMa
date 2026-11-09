package com.example.tama.task.service;

import com.example.tama.common.exception.BadRequestException;
import com.example.tama.common.exception.ResourceNotFoundException;
import com.example.tama.entity.Project;
import com.example.tama.entity.Task;
import com.example.tama.entity.TaskPriority;
import com.example.tama.entity.TaskStatus;
import com.example.tama.entity.User;
import com.example.tama.entity.Workspace;
import com.example.tama.project.repository.ProjectRepository;
import com.example.tama.task.dto.CreateTaskRequest;
import com.example.tama.task.dto.TaskResponse;
import com.example.tama.task.dto.UpdateTaskRequest;
import com.example.tama.task.repository.TaskRepository;
import com.example.tama.user.repository.UserRepository;
import com.example.tama.workspace.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class TaskService {
    private final TaskRepository tasks;
    private final WorkspaceRepository workspaces;
    private final ProjectRepository projects;
    private final UserRepository users;

    public TaskService(TaskRepository tasks, WorkspaceRepository workspaces,
                       ProjectRepository projects, UserRepository users) {
        this.tasks = tasks;
        this.workspaces = workspaces;
        this.projects = projects;
        this.users = users;
    }

    @Transactional
    public TaskResponse create(CreateTaskRequest request) {
        requireText(request.title());
        Workspace workspace = workspaces.findById(request.workspaceId())
                .orElseThrow(() -> new ResourceNotFoundException("Workspace", request.workspaceId()));
        User creator = users.findById(request.createdByUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", request.createdByUserId()));
        Task task = new Task();
        task.setWorkspace(workspace);
        task.setCreatedBy(creator);
        task.setTitle(request.title().trim());
        task.setDescription(request.description());
        task.setDueAt(request.dueAt());
        task.setPriority(request.priority() == null ? TaskPriority.MEDIUM : request.priority());
        task.setColor(request.color());
        task.setStatus(TaskStatus.TODO);
        if (request.projectId() != null) task.setProject(getProjectInWorkspace(request.projectId(), workspace.getId()));
        if (request.assigneeId() != null) task.setAssignee(getUser(request.assigneeId()));
        return toResponse(tasks.save(task));
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> findByWorkspace(UUID workspaceId, UUID projectId) {
        List<Task> result = projectId == null
                ? tasks.findByWorkspaceIdAndArchivedAtIsNullOrderByDueAtAscCreatedAtDesc(workspaceId)
                : tasks.findByWorkspaceIdAndProjectIdAndArchivedAtIsNullOrderByDueAtAsc(workspaceId, projectId);
        return result.stream().map(TaskService::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public TaskResponse findById(UUID id) { return toResponse(getTask(id)); }

    @Transactional
    public TaskResponse update(UUID id, UpdateTaskRequest request) {
        Task task = getTask(id);
        if (request.title() != null) {
            requireText(request.title());
            task.setTitle(request.title().trim());
        }
        if (request.description() != null) task.setDescription(request.description());
        if (request.dueAt() != null) task.setDueAt(request.dueAt());
        if (request.status() != null) task.setStatus(request.status());
        if (request.priority() != null) task.setPriority(request.priority());
        if (request.color() != null) task.setColor(request.color());
        if (request.projectId() != null) task.setProject(getProjectInWorkspace(request.projectId(), task.getWorkspace().getId()));
        if (request.assigneeId() != null) task.setAssignee(getUser(request.assigneeId()));
        return toResponse(tasks.save(task));
    }

    @Transactional
    public TaskResponse setStatus(UUID id, TaskStatus status) {
        Task task = getTask(id);
        task.setStatus(status);
        return toResponse(tasks.save(task));
    }

    @Transactional
    public void delete(UUID id) {
        Task task = getTask(id);
        task.setArchivedAt(Instant.now());
        tasks.save(task);
    }

    private Task getTask(UUID id) {
        return tasks.findById(id).filter(task -> task.getArchivedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));
    }

    private Project getProjectInWorkspace(UUID projectId, UUID workspaceId) {
        Project project = projects.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", projectId));
        if (!project.getWorkspace().getId().equals(workspaceId)) {
            throw new BadRequestException("Project must belong to the task workspace");
        }
        return project;
    }

    private User getUser(UUID id) {
        return users.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", id));
    }

    private static void requireText(String title) {
        if (title == null || title.isBlank()) throw new BadRequestException("Task title is required");
    }

    private static TaskResponse toResponse(Task task) {
        return new TaskResponse(task.getId(), task.getWorkspace().getId(),
                task.getProject() == null ? null : task.getProject().getId(),
                task.getProject() == null ? null : task.getProject().getName(),
                task.getTitle(), task.getDescription(), task.getDueAt(), task.getStatus(), task.getPriority(),
                task.getColor(), task.getCreatedBy().getId(),
                task.getAssignee() == null ? null : task.getAssignee().getId(), task.getCompletedAt(),
                task.getCreatedAt(), task.getUpdatedAt());
    }
}
