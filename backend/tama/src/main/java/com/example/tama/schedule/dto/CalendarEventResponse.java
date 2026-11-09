package com.example.tama.schedule.dto;

import java.time.Instant;
import java.util.UUID;

public record CalendarEventResponse(UUID id, UUID workspaceId, String title, String description,
                                    Instant startAt, Instant endAt, String location, String color) { }
