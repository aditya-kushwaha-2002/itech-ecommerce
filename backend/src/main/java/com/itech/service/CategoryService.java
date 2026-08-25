package com.itech.service;

import com.itech.dto.CategoryRequest;
import com.itech.entity.Category;
import com.itech.exception.ApiException;
import com.itech.repository.CategoryRepository;
import com.itech.repository.ProductRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class CategoryService {

  private final CategoryRepository categoryRepository;
  private final ProductRepository productRepository;

  public CategoryService(
      CategoryRepository categoryRepository, ProductRepository productRepository) {
    this.categoryRepository = categoryRepository;
    this.productRepository = productRepository;
  }

  public Category createCategory(CategoryRequest request) {
    String name = request.getName().trim();
    if (categoryRepository.findByNameIgnoreCase(name).isPresent())
      throw ApiException.conflict("A category with this name already exists");
    Category category = new Category();
    category.setName(name);
    return categoryRepository.save(category);
  }

  public List<Category> getAllCategories() {
    return categoryRepository.findAll();
  }

  public Category updateCategory(Long id, CategoryRequest request) {
    Category category =
        categoryRepository
            .findById(id)
            .orElseThrow(() -> ApiException.notFound("Category not found"));
    String name = request.getName().trim();
    categoryRepository
        .findByNameIgnoreCase(name)
        .filter(found -> found.getId() != id)
        .ifPresent(
            found -> {
              throw ApiException.conflict("A category with this name already exists");
            });
    category.setName(name);
    return categoryRepository.save(category);
  }

  public void deleteCategory(Long id) {
    if (!categoryRepository.existsById(id)) throw ApiException.notFound("Category not found");
    if (productRepository.countByCategoryId(id) > 0)
      throw ApiException.conflict("This category is still used by products");
    categoryRepository.deleteById(id);
  }
}
