package com.example.backend.Auth.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.Auth.dto.AuthResponse;
import com.example.backend.Auth.dto.LoginRequest;
import com.example.backend.Auth.entity.User;
import com.example.backend.Auth.exception.BadRequestException;
import com.example.backend.Auth.repository.UserRepository;
import com.example.backend.Auth.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new BadRequestException("Email ou mot de passe incorrect"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Mot de passe incorrect");
        }
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getEmail(), user.getNom(), user.getPrenom(), user.getRole());
    }
}
