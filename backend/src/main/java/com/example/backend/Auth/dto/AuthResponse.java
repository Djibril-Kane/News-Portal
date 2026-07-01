package com.example.backend.Auth.dto;

import com.example.backend.Auth.entity.User;
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
