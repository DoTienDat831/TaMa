package com.example.tama.auth.service;

import com.example.tama.auth.dto.LoginRequest;
import com.example.tama.auth.dto.LoginResponse;
import com.example.tama.common.exception.UnauthorizedException;
import com.example.tama.entity.User;
import com.example.tama.user.dto.UserResponse;
import com.example.tama.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository users, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        if (request.email() == null || request.password() == null) {
            throw new UnauthorizedException("Invalid email or password");
        }

        User user = users.findByEmailIgnoreCase(request.email().trim().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        UserResponse response = new UserResponse(user.getId(), user.getEmail(), user.getFullName(),
                user.getAvatarUrl(), user.getCreatedAt());
        return new LoginResponse(response);
    }
}
