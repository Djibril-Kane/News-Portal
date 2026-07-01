package com.example.backend.User.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.backend.exception.BadRequestException;
import com.example.backend.User.dto.CreateServiceTokenRequest;
import com.example.backend.User.dto.ServiceTokenResponse;
import com.example.backend.User.entity.ServiceToken;
import com.example.backend.User.repository.ServiceTokenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceTokenService {

    private final ServiceTokenRepository serviceTokenRepository;

    public List<ServiceTokenResponse> getAll() {
        return serviceTokenRepository.findAll().stream().map(this::toResponse).toList();
    }

    public ServiceTokenResponse generate(CreateServiceTokenRequest request) {
        ServiceToken token = new ServiceToken();
        token.setToken(UUID.randomUUID().toString());
        token.setDescription(request.getDescription());
        token.setActive(true);
        token.setCreatedAt(LocalDateTime.now());

        return toResponse(serviceTokenRepository.save(token));
    }

    public void revoke(Long id) {
        ServiceToken token = serviceTokenRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Jeton introuvable"));

        token.setActive(false);
        serviceTokenRepository.save(token);
    }

    public boolean isValid(String tokenValue) {
        return serviceTokenRepository.findByToken(tokenValue)
                .map(ServiceToken::isActive)
                .orElse(false);
    }

    private ServiceTokenResponse toResponse(ServiceToken token) {
        return new ServiceTokenResponse(token.getId(), token.getToken(), token.getDescription(),
                token.isActive(), token.getCreatedAt());
    }
}
