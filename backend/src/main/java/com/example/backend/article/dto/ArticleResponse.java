package com.example.backend.article.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ArticleResponse {

    private Long id;
    private String titre;
    private String resume;
    private String contenu;
    private LocalDateTime datePublication;
    private Long categoryId;
    private String categoryNom;
}
