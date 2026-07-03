package com.example.backend.article.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.article.dto.ArticleResponse;
import com.example.backend.article.dto.CreateArticleRequest;
import com.example.backend.article.dto.UpdateArticleRequest;
import com.example.backend.article.service.ArticleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    @GetMapping
    public ResponseEntity<Page<ArticleResponse>> getAll(
            @PageableDefault(size = 10, sort = "datePublication", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(articleService.getAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticleResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(articleService.getById(id));
    }

    @GetMapping("/categorie/{categoryId}")
    public ResponseEntity<List<ArticleResponse>> getByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(articleService.getByCategory(categoryId));
    }

    @PreAuthorize("hasAnyRole('EDITEURS', 'ADMINS')")
    @PostMapping
    public ResponseEntity<ArticleResponse> create(@Valid @RequestBody CreateArticleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(articleService.create(request));
    }

    @PreAuthorize("hasAnyRole('EDITEURS', 'ADMINS')")
    @PutMapping("/{id}")
    public ResponseEntity<ArticleResponse> update(@PathVariable Long id, @Valid @RequestBody UpdateArticleRequest request) {
        return ResponseEntity.ok(articleService.update(id, request));
    }

    @PreAuthorize("hasAnyRole('EDITEURS', 'ADMINS')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        articleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
