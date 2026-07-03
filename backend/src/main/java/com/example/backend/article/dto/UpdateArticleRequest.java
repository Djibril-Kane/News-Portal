package com.example.backend.article.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateArticleRequest {

    @NotBlank
    private String titre;

    @NotBlank
    private String resume;

    @NotBlank
    private String contenu;

    @NotNull
    private Long categoryId;
}
