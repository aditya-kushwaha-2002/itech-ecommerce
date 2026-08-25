package com.itech.service;

import com.itech.dto.ProductRequest;
import com.itech.dto.ProductResponse;
import com.itech.entity.Category;
import com.itech.entity.Product;
import com.itech.exception.ApiException;
import com.itech.exception.ProductNotFoundException;
import com.itech.repository.CategoryRepository;
import com.itech.repository.ProductRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

  private final ProductRepository productRepository;
  private final CategoryRepository categoryRepository;

  public ProductService(
      ProductRepository productRepository, CategoryRepository categoryRepository) {

    this.productRepository = productRepository;
    this.categoryRepository = categoryRepository;
  }

  public ProductResponse createProduct(ProductRequest request) {

    Category category =
        categoryRepository
            .findById(request.getCategoryId())
            .orElseThrow(() -> ApiException.notFound("Category not found"));

    Product product = new Product();

    product.setName(request.getName());
    product.setBrand(request.getBrand());
    product.setDescription(request.getDescription());
    product.setPrice(request.getPrice());
    product.setDiscount(request.getDiscount());
    product.setImageUrl(request.getImageUrl());
    product.setCategory(category);

    Product saveProduct = productRepository.save(product);

    return convertToResponse(saveProduct);
  }

  public List<ProductResponse> getAllProducts(String search) {

    List<Product> products =
        search == null || search.isBlank()
            ? productRepository.findAll()
            : productRepository.findByNameContainingIgnoreCaseOrBrandContainingIgnoreCase(
                search.trim(), search.trim());

    return products.stream().map(this::convertToResponse).toList();
  }

  public ProductResponse updateProduct(Long id, ProductRequest request) {

    Product product =
        productRepository
            .findById(id)
            .orElseThrow(() -> ApiException.notFound("Product not found"));

    Category category =
        categoryRepository
            .findById(request.getCategoryId())
            .orElseThrow(() -> ApiException.notFound("Category not found"));

    product.setName(request.getName().trim());
    product.setBrand(request.getBrand().trim());
    product.setDescription(request.getDescription());
    product.setPrice(request.getPrice());
    product.setDiscount(request.getDiscount());
    product.setImageUrl(request.getImageUrl());
    product.setCategory(category);

    return convertToResponse(productRepository.save(product));
  }

  public void deleteProduct(Long id) {

    Product product =
        productRepository
            .findById(id)
            .orElseThrow(() -> ApiException.notFound("Product not found"));

    productRepository.delete(product);
    
  }

  public ProductResponse getProductById(Long id) {

    Product product =
        productRepository
            .findById(id)
            .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));

    return convertToResponse(product);
  }

  private ProductResponse convertToResponse(Product product) {

    return new ProductResponse(
        product.getId(),
        product.getName(),
        product.getBrand(),
        product.getDescription(),
        product.getPrice(),
        product.getDiscount(),
        product.getImageUrl(),
        product.getCategory().getId(),
        product.getCategory().getName());
  }
}
