package com.example.backend.User.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.User.dto.CreateServiceTokenRequest;
import com.example.backend.User.dto.ServiceTokenResponse;
import com.example.backend.User.service.ServiceTokenService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users/tokens")
@RequiredArgsConstructor
public class ServiceTokenController {

    private final ServiceTokenService serviceTokenService;

    @PreAuthorize("hasRole('ADMINS')")
    @GetMapping
    public ResponseEntity<List<ServiceTokenResponse>> getAll() {
        return ResponseEntity.ok(serviceTokenService.getAll());
    }

    @PreAuthorize("hasRole('ADMINS')")
    @PostMapping
    public ResponseEntity<ServiceTokenResponse> generate(@RequestBody CreateServiceTokenRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceTokenService.generate(request));
    }

    @PreAuthorize("hasRole('ADMINS')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> revoke(@PathVariable Long id) {
        serviceTokenService.revoke(id);
        return ResponseEntity.noContent().build();
    }
}
