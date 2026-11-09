package com.example.tama.user.service;

import com.example.tama.common.exception.BadRequestException;
import com.example.tama.common.exception.ResourceNotFoundException;
import com.example.tama.entity.User;
import com.example.tama.user.dto.CreateUserRequest;
import com.example.tama.user.dto.UserResponse;
import com.example.tama.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class UserService {
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository users, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponse create(CreateUserRequest request) {
        if (request.email() == null || !EMAIL_PATTERN.matcher(request.email().trim()).matches()) {
            throw new BadRequestException("A valid email is required");
        }
        if (request.password() == null || request.password().length() < 8) {
            throw new BadRequestException("Password must contain at least 8 characters");
        }
        if (request.fullName() == null || request.fullName().isBlank()) {
            throw new BadRequestException("Full name is required");
        }
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        if (users.findByEmailIgnoreCase(email).isPresent()) throw new BadRequestException("Email is already registered");
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFullName(request.fullName().trim());
        return toResponse(users.save(user));
    }

    @Transactional(readOnly = true)
    public UserResponse findById(UUID id) {
        return users.findById(id).map(UserService::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
    }

    private static UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getFullName(), user.getAvatarUrl(), user.getCreatedAt());
    }
}
