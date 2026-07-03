package com.example.backend.article.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.article.entity.Article;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    List<Article> findByCategory_IdOrderByDatePublicationDesc(Long categoryId);

    List<Article> findAllByOrderByDatePublicationDesc();
}
