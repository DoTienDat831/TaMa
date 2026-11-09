package com.example.tama.project.controller;

import com.example.tama.project.dto.CreateProjectRequest;
import com.example.tama.project.dto.ProjectResponse;
import com.example.tama.project.dto.UpdateProjectRequest;
import com.example.tama.project.service.ProjectService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService service;

    public ProjectController(ProjectService service) { this.service = service; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse create(@RequestBody CreateProjectRequest request) { return service.create(request); }

    @GetMapping
    public List<ProjectResponse> findByWorkspace(@RequestParam UUID workspaceId) { return service.findByWorkspace(workspaceId); }

    @GetMapping("/{id}")
    public ProjectResponse findById(@PathVariable UUID id) { return service.findById(id); }

    @PutMapping("/{id}")
    public ProjectResponse update(@PathVariable UUID id, @RequestBody UpdateProjectRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
