package com.itech.service;

import com.itech.dto.ProductVariantRequest;
import com.itech.dto.ProductVariantResponse;
import com.itech.entity.Product;
import com.itech.entity.ProductVariant;
import com.itech.exception.ApiException;
import com.itech.repository.InventoryRepository;
import com.itech.repository.ProductRepository;
import com.itech.repository.ProductVariantRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProductVariantService {

  private final ProductVariantRepository varianrtRepository;

  private final ProductRepository productRepository;
  private final InventoryRepository inventoryRepository;

  public ProductVariantService(
      ProductVariantRepository varianrtRepository,
      ProductRepository productRepository,
      InventoryRepository inventoryRepository) {

    this.varianrtRepository = varianrtRepository;
    this.productRepository = productRepository;
    this.inventoryRepository = inventoryRepository;
  }

  public ProductVariantResponse createVariant(Long productId, ProductVariantRequest request) {

    Product product =
        productRepository
            .findById(productId)
            .orElseThrow(() -> ApiException.notFound("Product not found"));

    assertUnique(productId, request.getColor(), request.getStorage(), null);

    ProductVariant variant = new ProductVariant();

    variant.setColor(request.getColor());
    variant.setStorage(request.getStorage());
    variant.setPrice(request.getPrice());
    variant.setProduct(product);

    ProductVariant savedVariant = varianrtRepository.save(variant);

    return mapToResponse(savedVariant);
  }

  public List<ProductVariantResponse> getVariants(Long productId) {

    return varianrtRepository.findByProductId(productId).stream().map(this::mapToResponse).toList();
  }

  public ProductVariantResponse updateVariant(Long variantId, ProductVariantRequest request) {

    ProductVariant variant =
        varianrtRepository
            .findById(variantId)
            .orElseThrow(() -> ApiException.notFound("Product variant not found"));

    assertUnique(variant.getProduct().getId(), request.getColor(), request.getStorage(), variantId);

    variant.setColor(request.getColor().trim());
    variant.setStorage(request.getStorage().trim());
    variant.setPrice(request.getPrice());

    return mapToResponse(varianrtRepository.save(variant));
  }

  public void deleteVariant(Long variantId) {

    ProductVariant variant =
        varianrtRepository
            .findById(variantId)
            .orElseThrow(() -> ApiException.notFound("Product variant not found"));

    if (inventoryRepository.findByVariantId(variantId).isPresent())
      throw ApiException.conflict("Remove the inventory record before deleting this variant");

    varianrtRepository.delete(variant);
  }

  private void assertUnique(Long productId, String color, String storage, Long currentId) {
    
    varianrtRepository.findByProductId(productId).stream()
        .filter(item -> !item.getId().equals(currentId == null ? -1L : currentId))
        .filter(
            item ->
                item.getColor().equalsIgnoreCase(color.trim())
                    && item.getStorage().equalsIgnoreCase(storage.trim()))
        .findFirst()
        .ifPresent(
            item -> {
              throw ApiException.conflict(
                  "This color and storage combination already exists for the product");
            });
  }

  private ProductVariantResponse mapToResponse(ProductVariant variant) {

    return new ProductVariantResponse(
        variant.getId(),
        variant.getColor(),
        variant.getStorage(),
        variant.getPrice(),
        variant.getProduct().getId());
  }
}
