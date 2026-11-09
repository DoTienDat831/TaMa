package com.example.tama.schedule.controller;

import com.example.tama.schedule.dto.CalendarEventRequest;
import com.example.tama.schedule.dto.CalendarEventResponse;
import com.example.tama.schedule.service.CalendarEventService;
import org.springframework.format.annotation.DateTimeFormat;
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

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
public class CalendarEventController {
    private final CalendarEventService service;

    public CalendarEventController(CalendarEventService service) { this.service = service; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CalendarEventResponse create(@RequestBody CalendarEventRequest request) { return service.create(request); }

    @GetMapping
    public List<CalendarEventResponse> findByRange(@RequestParam UUID workspaceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to) {
        return service.findByRange(workspaceId, from, to);
    }

    @PutMapping("/{id}")
    public CalendarEventResponse update(@PathVariable UUID id, @RequestBody CalendarEventRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
