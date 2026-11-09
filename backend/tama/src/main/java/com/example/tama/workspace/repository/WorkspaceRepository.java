package com.example.tama.workspace.repository;

import com.example.tama.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface WorkspaceRepository extends JpaRepository<Workspace, UUID> {
    @Query("select wm.workspace from WorkspaceMember wm where wm.user.id = :userId order by wm.workspace.name")
    List<Workspace> findAllForUser(@Param("userId") UUID userId);
}
