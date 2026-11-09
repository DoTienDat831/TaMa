package com.example.tama.dashboard.service;

import com.example.tama.dashboard.dto.DashboardSummaryResponse;
import com.example.tama.entity.TaskStatus;
import com.example.tama.task.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class DashboardService {
    private final TaskRepository tasks;

    public DashboardService(TaskRepository tasks) { this.tasks = tasks; }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse summary(UUID workspaceId, Instant from, Instant to) {
        long total = tasks.countByWorkspaceIdAndArchivedAtIsNull(workspaceId);
        long completed = tasks.countByWorkspaceIdAndStatusAndArchivedAtIsNull(workspaceId, TaskStatus.DONE);
        long due = from == null || to == null ? 0
                : tasks.countByWorkspaceIdAndDueAtBetweenAndArchivedAtIsNull(workspaceId, from, to);
        return new DashboardSummaryResponse(total, completed, total - completed, due);
    }
}
