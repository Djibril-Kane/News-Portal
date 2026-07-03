package com.example.backend.category.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateCategoryRequest {

    @NotBlank
    private String nom;

    private String description;
}
