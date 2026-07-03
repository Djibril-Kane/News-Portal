package com.example.backend.config;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.xml.MappingJackson2XmlHttpMessageConverter;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

// permet de choisir le format de reponse du service REST via ?format=json ou ?format=xml
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer
                .favorParameter(true)
                .parameterName("format")
                .defaultContentType(MediaType.APPLICATION_JSON)
                .mediaType("json", MediaType.APPLICATION_JSON)
                .mediaType("xml", MediaType.APPLICATION_XML);
    }

    // Spring Boot 4 configure l'ObjectMapper JSON en Jackson 3 (support natif de java.time),
    // mais jackson-dataformat-xml reste en Jackson 2 et Boot n'expose plus de hook pour le
    // configurer automatiquement : sans JavaTimeModule explicite, la serialisation XML d'un
    // LocalDateTime plantait en 500 (masque en 403 via la redirection Tomcat vers /error)
    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        ObjectMapper xmlMapper = new XmlMapper();
        xmlMapper.registerModule(new JavaTimeModule());
        xmlMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        // insere en tete de liste : Boot enregistre deja son propre convertisseur XML
        // (sans JavaTimeModule) des que jackson-datatype-jsr310 est sur le classpath,
        // et il serait choisi en premier s'il restait derriere dans la liste
        converters.add(0, new MappingJackson2XmlHttpMessageConverter(xmlMapper));
    }
}
