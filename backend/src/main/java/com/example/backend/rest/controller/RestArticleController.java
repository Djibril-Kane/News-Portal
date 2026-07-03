package com.example.backend.rest.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.rest.dto.ArticleListResponse;
import com.example.backend.rest.dto.GroupedArticlesResponse;
import com.example.backend.rest.service.RestArticleService;

import lombok.RequiredArgsConstructor;

// service REST public, format JSON ou XML au choix (voir WebConfig, parametre ?format=)
@RestController
@RequestMapping("/api/rest/articles")
@RequiredArgsConstructor
public class RestArticleController {

    private final RestArticleService restArticleService;

    @GetMapping(produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
    public ArticleListResponse getAll() {
        return restArticleService.getAll();
    }

    @GetMapping(value = "/grouped", produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
    public GroupedArticlesResponse getGrouped() {
        return restArticleService.getGroupedByCategory();
    }

    @GetMapping(value = "/categorie/{nom}", produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
    public ArticleListResponse getByCategory(@PathVariable String nom) {
        return restArticleService.getByCategory(nom);
    }
}
