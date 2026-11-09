package com.example.tama.schedule.service;

import com.example.tama.common.exception.BadRequestException;
import com.example.tama.common.exception.ResourceNotFoundException;
import com.example.tama.entity.CalendarEvent;
import com.example.tama.entity.User;
import com.example.tama.entity.Workspace;
import com.example.tama.schedule.dto.CalendarEventRequest;
import com.example.tama.schedule.dto.CalendarEventResponse;
import com.example.tama.schedule.repository.CalendarEventRepository;
import com.example.tama.user.repository.UserRepository;
import com.example.tama.workspace.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class CalendarEventService {
    private final CalendarEventRepository events;
    private final WorkspaceRepository workspaces;
    private final UserRepository users;

    public CalendarEventService(CalendarEventRepository events, WorkspaceRepository workspaces, UserRepository users) {
        this.events = events;
        this.workspaces = workspaces;
        this.users = users;
    }

    @Transactional
    public CalendarEventResponse create(CalendarEventRequest request) {
        validate(request);
        Workspace workspace = workspaces.findById(request.workspaceId())
                .orElseThrow(() -> new ResourceNotFoundException("Workspace", request.workspaceId()));
        User creator = users.findById(request.createdByUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", request.createdByUserId()));
        CalendarEvent event = new CalendarEvent();
        event.setWorkspace(workspace);
        event.setCreatedBy(creator);
        apply(event, request);
        return toResponse(events.save(event));
    }

    @Transactional(readOnly = true)
    public List<CalendarEventResponse> findByRange(UUID workspaceId, Instant from, Instant to) {
        if (from == null || to == null || to.isBefore(from)) throw new BadRequestException("Invalid event date range");
        return events.findByWorkspaceIdAndStartAtBetweenOrderByStartAt(workspaceId, from, to)
                .stream().map(CalendarEventService::toResponse).toList();
    }

    @Transactional
    public CalendarEventResponse update(UUID id, CalendarEventRequest request) {
        validate(request);
        CalendarEvent event = events.findById(id).orElseThrow(() -> new ResourceNotFoundException("Calendar event", id));
        if (!event.getWorkspace().getId().equals(request.workspaceId())) {
            throw new BadRequestException("Event workspace cannot be changed");
        }
        apply(event, request);
        return toResponse(events.save(event));
    }

    @Transactional
    public void delete(UUID id) {
        if (!events.existsById(id)) throw new ResourceNotFoundException("Calendar event", id);
        events.deleteById(id);
    }

    private static void validate(CalendarEventRequest request) {
        if (request.title() == null || request.title().isBlank()) throw new BadRequestException("Event title is required");
        if (request.startAt() == null || request.endAt() == null || !request.endAt().isAfter(request.startAt())) {
            throw new BadRequestException("Event end time must be after start time");
        }
    }

    private static void apply(CalendarEvent event, CalendarEventRequest request) {
        event.setTitle(request.title().trim());
        event.setDescription(request.description());
        event.setStartAt(request.startAt());
        event.setEndAt(request.endAt());
        event.setLocation(request.location());
        event.setColor(request.color());
    }

    private static CalendarEventResponse toResponse(CalendarEvent event) {
        return new CalendarEventResponse(event.getId(), event.getWorkspace().getId(), event.getTitle(),
                event.getDescription(), event.getStartAt(), event.getEndAt(), event.getLocation(), event.getColor());
    }
}
