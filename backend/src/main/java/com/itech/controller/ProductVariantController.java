package com.itech.controller;

import com.itech.dto.ProductVariantRequest;
import com.itech.dto.ProductVariantResponse;
import com.itech.service.ProductVariantService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class ProductVariantController {

  private final ProductVariantService variantService;

  public ProductVariantController(ProductVariantService variantService) {
    this.variantService = variantService;
  }

  @PostMapping("/{productId}/variants")
  @ResponseStatus(HttpStatus.CREATED)
  public ProductVariantResponse createVariant(
      @PathVariable Long productId, @Valid @RequestBody ProductVariantRequest request) {

    return variantService.createVariant(productId, request);
  }

  @GetMapping("/{productId}/variants")
  public List<ProductVariantResponse> getVariants(@PathVariable Long productId) {

    return variantService.getVariants(productId);
  }

  @PutMapping("/variants/{variantId}")
  public ProductVariantResponse update(
      @PathVariable Long variantId, @Valid @RequestBody ProductVariantRequest request) {

    return variantService.updateVariant(variantId, request);
  }

  @DeleteMapping("/variants/{variantId}")
  public void delete(@PathVariable Long variantId) {
    
    variantService.deleteVariant(variantId);
  }
}
