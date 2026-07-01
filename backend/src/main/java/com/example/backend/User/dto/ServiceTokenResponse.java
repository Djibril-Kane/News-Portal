package com.example.backend.user.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ServiceTokenResponse {

    private Long id;
    private String token;
    private String description;
    private boolean active;
    private LocalDateTime createdAt;
}
