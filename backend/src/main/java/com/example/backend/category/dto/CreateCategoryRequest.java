package com.example.backend.category.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateCategoryRequest {

    @NotBlank
    private String nom;

    private String description;
}
