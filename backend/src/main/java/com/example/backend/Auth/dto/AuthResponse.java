package com.example.backend.auth.dto;

import com.example.backend.auth.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String email;
    private String nom;
    private String prenom;
    private User.Role role;
}
