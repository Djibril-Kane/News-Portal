package com.example.backend.rest.dto;

import java.util.List;

import com.example.backend.article.dto.ArticleResponse;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;

import lombok.AllArgsConstructor;
import lombok.Data;

// enveloppe utilisee pour avoir une racine XML propre (<articles><article>...)
@Data
@AllArgsConstructor
@JacksonXmlRootElement(localName = "articles")
public class ArticleListResponse {

    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "article")
    private List<ArticleResponse> articles;
}
