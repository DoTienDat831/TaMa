package com.example.tama.workspace.controller;

import com.example.tama.workspace.dto.CreateWorkspaceRequest;
import com.example.tama.workspace.dto.WorkspaceResponse;
import com.example.tama.workspace.service.WorkspaceService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/workspaces")
public class WorkspaceController {
    private final WorkspaceService service;

    public WorkspaceController(WorkspaceService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WorkspaceResponse create(@RequestBody CreateWorkspaceRequest request) {
        return service.create(request);
    }

    @GetMapping("/by-user/{userId}")
    public List<WorkspaceResponse> findForUser(@PathVariable UUID userId) {
        return service.findForUser(userId);
    }
}
