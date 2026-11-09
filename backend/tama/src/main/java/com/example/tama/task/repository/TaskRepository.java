package com.example.tama.task.repository;

import com.example.tama.entity.Task;
import com.example.tama.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByWorkspaceIdAndArchivedAtIsNullOrderByDueAtAscCreatedAtDesc(UUID workspaceId);
    List<Task> findByWorkspaceIdAndProjectIdAndArchivedAtIsNullOrderByDueAtAsc(UUID workspaceId, UUID projectId);
    long countByWorkspaceIdAndArchivedAtIsNull(UUID workspaceId);
    long countByWorkspaceIdAndStatusAndArchivedAtIsNull(UUID workspaceId, TaskStatus status);
    long countByWorkspaceIdAndDueAtBetweenAndArchivedAtIsNull(UUID workspaceId, Instant start, Instant end);
}
