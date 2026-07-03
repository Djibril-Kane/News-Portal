package com.example.backend.rest.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.article.dto.ArticleResponse;
import com.example.backend.article.entity.Article;
import com.example.backend.article.repository.ArticleRepository;
import com.example.backend.category.dto.CategoryResponse;
import com.example.backend.category.service.CategoryService;
import com.example.backend.exception.BadRequestException;
import com.example.backend.rest.dto.ArticleListResponse;
import com.example.backend.rest.dto.CategoryArticlesResponse;
import com.example.backend.rest.dto.GroupedArticlesResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RestArticleService {

    private final ArticleRepository articleRepository;
    private final CategoryService categoryService;

    public ArticleListResponse getAll() {
        List<ArticleResponse> articles = articleRepository.findAllByOrderByDatePublicationDesc()
                .stream().map(this::toResponse).toList();
        return new ArticleListResponse(articles);
    }

    public ArticleListResponse getByCategory(String categoryNom) {
        CategoryResponse category = categoryService.getAll().stream()
                .filter(c -> c.getNom().equalsIgnoreCase(categoryNom))
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Categorie introuvable"));

        List<ArticleResponse> articles = articleRepository.findByCategory_IdOrderByDatePublicationDesc(category.getId())
                .stream().map(this::toResponse).toList();
        return new ArticleListResponse(articles);
    }

    public GroupedArticlesResponse getGroupedByCategory() {
        List<CategoryArticlesResponse> groups = categoryService.getAll().stream()
                .map(category -> new CategoryArticlesResponse(
                        category.getNom(),
                        articleRepository.findByCategory_IdOrderByDatePublicationDesc(category.getId())
                                .stream().map(this::toResponse).toList()))
                .toList();
        return new GroupedArticlesResponse(groups);
    }

    private ArticleResponse toResponse(Article article) {
        return new ArticleResponse(
                article.getId(),
                article.getTitre(),
                article.getResume(),
                article.getContenu(),
                article.getDatePublication(),
                article.getCategory().getId(),
                article.getCategory().getNom());
    }
}
