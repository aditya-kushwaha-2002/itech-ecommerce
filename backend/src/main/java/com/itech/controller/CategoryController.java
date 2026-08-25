package com.itech.controller;

import com.itech.dto.CategoryRequest;
import com.itech.entity.Category;
import com.itech.service.CategoryService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

  private final CategoryService categoryService;

  public CategoryController(CategoryService categoryService) {
    this.categoryService = categoryService;
  }

  @PostMapping
  public Category creaCategory(@Valid @RequestBody CategoryRequest category) {

    return categoryService.createCategory(category);
  }

  @GetMapping
  public List<Category> getAllCategories() {

    return categoryService.getAllCategories();
  }

  @PutMapping("/{id}")
  public Category update(@PathVariable Long id, @Valid @RequestBody CategoryRequest category) {
    return categoryService.updateCategory(id, category);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    categoryService.deleteCategory(id);
  }
}
