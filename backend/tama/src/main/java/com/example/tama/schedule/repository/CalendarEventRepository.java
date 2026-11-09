package com.example.tama.schedule.repository;

import com.example.tama.entity.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface CalendarEventRepository extends JpaRepository<CalendarEvent, UUID> {
    List<CalendarEvent> findByWorkspaceIdAndStartAtBetweenOrderByStartAt(UUID workspaceId, Instant from, Instant to);
}
