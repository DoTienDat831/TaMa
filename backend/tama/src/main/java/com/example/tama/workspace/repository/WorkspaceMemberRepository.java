package com.example.tama.workspace.repository;

import com.example.tama.entity.WorkspaceMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMember, UUID> {
    boolean existsByWorkspaceIdAndUserId(UUID workspaceId, UUID userId);
}
