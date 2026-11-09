package com.example.tama.workspace.service;

import com.example.tama.common.exception.BadRequestException;
import com.example.tama.common.exception.ResourceNotFoundException;
import com.example.tama.entity.User;
import com.example.tama.entity.Workspace;
import com.example.tama.entity.WorkspaceMember;
import com.example.tama.entity.WorkspaceRole;
import com.example.tama.user.repository.UserRepository;
import com.example.tama.workspace.dto.CreateWorkspaceRequest;
import com.example.tama.workspace.dto.WorkspaceResponse;
import com.example.tama.workspace.repository.WorkspaceMemberRepository;
import com.example.tama.workspace.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class WorkspaceService {
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository memberRepository;
    private final UserRepository userRepository;

    public WorkspaceService(WorkspaceRepository workspaceRepository,
                            WorkspaceMemberRepository memberRepository,
                            UserRepository userRepository) {
        this.workspaceRepository = workspaceRepository;
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public WorkspaceResponse create(CreateWorkspaceRequest request) {
        if (request.name() == null || request.name().isBlank()) {
            throw new BadRequestException("Workspace name is required");
        }
        User owner = userRepository.findById(request.createdByUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", request.createdByUserId()));
        Workspace workspace = new Workspace();
        workspace.setName(request.name().trim());
        workspace.setCreatedBy(owner);
        workspace = workspaceRepository.save(workspace);

        WorkspaceMember membership = new WorkspaceMember();
        membership.setWorkspace(workspace);
        membership.setUser(owner);
        membership.setRole(WorkspaceRole.OWNER);
        memberRepository.save(membership);
        return toResponse(workspace);
    }

    @Transactional(readOnly = true)
    public List<WorkspaceResponse> findForUser(UUID userId) {
        return workspaceRepository.findAllForUser(userId).stream()
                .map(WorkspaceService::toResponse).toList();
    }

    private static WorkspaceResponse toResponse(Workspace workspace) {
        return new WorkspaceResponse(workspace.getId(), workspace.getName(), workspace.getCreatedAt());
    }
}
