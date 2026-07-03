package com.example.backend.category.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.category.dto.CategoryResponse;
import com.example.backend.category.dto.CreateCategoryRequest;
import com.example.backend.category.dto.UpdateCategoryRequest;
import com.example.backend.category.entity.Category;
import com.example.backend.category.repository.CategoryRepository;
import com.example.backend.exception.BadRequestException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll().stream().map(this::toResponse).toList();
    }

    public CategoryResponse getById(Long id) {
        return toResponse(findEntity(id));
    }

    public CategoryResponse create(CreateCategoryRequest request) {
        if (categoryRepository.findByNomIgnoreCase(request.getNom()).isPresent()) {
            throw new BadRequestException("Cette categorie existe deja");
        }

        Category category = new Category();
        category.setNom(request.getNom());
        category.setDescription(request.getDescription());

        return toResponse(categoryRepository.save(category));
    }

    public CategoryResponse update(Long id, UpdateCategoryRequest request) {
        Category category = findEntity(id);
        category.setNom(request.getNom());
        category.setDescription(request.getDescription());

        return toResponse(categoryRepository.save(category));
    }

    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new BadRequestException("Categorie introuvable");
        }
        categoryRepository.deleteById(id);
    }

    // utilise par ArticleService pour lier un article a sa categorie
    public Category findEntity(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Categorie introuvable"));
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(category.getId(), category.getNom(), category.getDescription());
    }
}
