package com.itech.controller;

import com.itech.dto.ProductRequest;
import com.itech.dto.ProductResponse;
import com.itech.service.ProductService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class ProductController {

  private final ProductService productService;

  public ProductController(ProductService productService) {

    this.productService = productService;
  }

  @PostMapping
  public ProductResponse createProduct(@Valid @RequestBody ProductRequest request) {

    return productService.createProduct(request);
  }

  @GetMapping
  public List<ProductResponse> getAllProducts(
      @org.springframework.web.bind.annotation.RequestParam(required = false) String search) {

    return productService.getAllProducts(search);
  }

  @GetMapping("/{id}")
  public ProductResponse getProductsById(@PathVariable Long id) {

    return productService.getProductById(id);
  }

  @PutMapping("/{id}")
  public ProductResponse update(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
    return productService.updateProduct(id, request);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    productService.deleteProduct(id);
  }
}
