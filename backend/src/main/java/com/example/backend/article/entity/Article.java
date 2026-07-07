package com.example.backend.article.entity;

import java.time.LocalDateTime;

import com.example.backend.category.entity.Category;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "articles")
@NoArgsConstructor
@AllArgsConstructor
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String titre;

    // description sommaire affichee sur la page d'accueil
    @Column(nullable = false, length = 500)
    private String resume;

    // columnDefinition force LONGTEXT : sans ca Hibernate mappe @Lob sur TINYTEXT (255 caracteres max),
    // ce qui fait planter l'insertion des que le contenu d'un article depasse cette limite
    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String contenu;

    @Column(nullable = false)
    private LocalDateTime datePublication;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
}
