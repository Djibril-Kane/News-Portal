package com.example.backend.rest.dto;

import java.util.List;

import com.example.backend.article.dto.ArticleResponse;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryArticlesResponse {

    private String categorie;

    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "article")
    private List<ArticleResponse> articles;
}
