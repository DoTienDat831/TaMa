package com.example.tama.task.controller;

import com.example.tama.entity.TaskStatus;
import com.example.tama.task.dto.CreateTaskRequest;
import com.example.tama.task.dto.TaskResponse;
import com.example.tama.task.dto.UpdateTaskRequest;
import com.example.tama.task.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService service;

    public TaskController(TaskService service) { this.service = service; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse create(@RequestBody CreateTaskRequest request) { return service.create(request); }

    @GetMapping
    public List<TaskResponse> findByWorkspace(@RequestParam UUID workspaceId,
                                              @RequestParam(required = false) UUID projectId) {
        return service.findByWorkspace(workspaceId, projectId);
    }

    @GetMapping("/{id}")
    public TaskResponse findById(@PathVariable UUID id) { return service.findById(id); }

    @PutMapping("/{id}")
    public TaskResponse update(@PathVariable UUID id, @RequestBody UpdateTaskRequest request) {
        return service.update(id, request);
    }

    @PatchMapping("/{id}/status")
    public TaskResponse setStatus(@PathVariable UUID id, @RequestParam TaskStatus status) {
        return service.setStatus(id, status);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
