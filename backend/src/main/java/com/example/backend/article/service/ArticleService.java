package com.example.backend.article.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.backend.article.dto.ArticleResponse;
import com.example.backend.article.dto.CreateArticleRequest;
import com.example.backend.article.dto.UpdateArticleRequest;
import com.example.backend.article.entity.Article;
import com.example.backend.article.repository.ArticleRepository;
import com.example.backend.category.entity.Category;
import com.example.backend.category.service.CategoryService;
import com.example.backend.exception.BadRequestException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final CategoryService categoryService;

    // pagination par anciennete pour les boutons suivant/precedent de la page d'accueil
    public Page<ArticleResponse> getAll(Pageable pageable) {
        return articleRepository.findAll(pageable).map(this::toResponse);
    }

    public ArticleResponse getById(Long id) {
        return toResponse(findEntity(id));
    }

    public List<ArticleResponse> getByCategory(Long categoryId) {
        return articleRepository.findByCategory_IdOrderByDatePublicationDesc(categoryId)
                .stream().map(this::toResponse).toList();
    }

    public ArticleResponse create(CreateArticleRequest request) {
        Category category = categoryService.findEntity(request.getCategoryId());

        Article article = new Article();
        article.setTitre(request.getTitre());
        article.setResume(request.getResume());
        article.setContenu(request.getContenu());
        article.setDatePublication(LocalDateTime.now());
        article.setCategory(category);

        return toResponse(articleRepository.save(article));
    }

    public ArticleResponse update(Long id, UpdateArticleRequest request) {
        Article article = findEntity(id);
        Category category = categoryService.findEntity(request.getCategoryId());

        article.setTitre(request.getTitre());
        article.setResume(request.getResume());
        article.setContenu(request.getContenu());
        article.setCategory(category);

        return toResponse(articleRepository.save(article));
    }

    public void delete(Long id) {
        if (!articleRepository.existsById(id)) {
            throw new BadRequestException("Article introuvable");
        }
        articleRepository.deleteById(id);
    }

    private Article findEntity(Long id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Article introuvable"));
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
