package com.itech.service;

import com.itech.dto.AdminInventoryResponse;
import com.itech.dto.InventoryRequest;
import com.itech.dto.InventoryResponse;
import com.itech.entity.Inventory;
import com.itech.entity.ProductVariant;
import com.itech.repository.InventoryRepository;
import com.itech.repository.ProductVariantRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InventoryService {

  private InventoryRepository inventoryRepository;

  private ProductVariantRepository varianrtRepository;

  public InventoryService(
      InventoryRepository inventoryRepository, ProductVariantRepository varianrtRepository) {
    this.inventoryRepository = inventoryRepository;
    this.varianrtRepository = varianrtRepository;
  }

  // =========================== Create Inventory ==============================

  public InventoryResponse createInventory(Long variantId, InventoryRequest request) {

    ProductVariant variant =
        varianrtRepository
            .findById(variantId)
            .orElseThrow(() -> new RuntimeException("Product variant not found"));

    validateStock(request.getQuantity(), request.getReserved());

    if (inventoryRepository.findByVariantId(variantId).isPresent()) {
      throw new RuntimeException("Inventory already exists for this variant");
    }

    Inventory inventory = new Inventory();

    inventory.setQuantity(request.getQuantity());
    inventory.setReserved(request.getReserved());
    inventory.setVariant(variant);

    Inventory savedInventory = inventoryRepository.save(inventory);

    return mapToResponse(savedInventory);
  }

  // ====================== Get Inventory ====================================

  public InventoryResponse getInventory(Long variantId) {

    Inventory inventory =
        inventoryRepository
            .findByVariantId(variantId)
            .orElseThrow(() -> new RuntimeException("Inventory not found"));

    return mapToResponse(inventory);
  }

  // =================== Entity -> Response ====================================

  private InventoryResponse mapToResponse(Inventory inventory) {

    return new InventoryResponse(
        inventory.getId(),
        inventory.getVariant().getId(),
        inventory.getQuantity(),
        inventory.getReserved(),
        inventory.getAvailable());
  }

  public List<AdminInventoryResponse> getAllInventory() {
    return inventoryRepository.findAll().stream().map(this::mapToAdminResponse).toList();
  }

  @Transactional
  public InventoryResponse updateInventory(Long variantId, InventoryRequest request) {
    validateStock(request.getQuantity(), request.getReserved());
    Inventory inventory =
        inventoryRepository
            .findByVariantId(variantId)
            .orElseThrow(() -> new RuntimeException("Inventory not found"));
    inventory.setQuantity(request.getQuantity());
    inventory.setReserved(request.getReserved());
    return mapToResponse(inventoryRepository.save(inventory));
  }

  private void validateStock(Integer quantity, Integer reserved) {
    if (quantity == null
        || quantity < 0
        || reserved == null
        || reserved < 0
        || reserved > quantity) {
      throw new RuntimeException(
          "Inventory requires non-negative quantity and reserved stock no greater than quantity");
    }
  }

  private AdminInventoryResponse mapToAdminResponse(Inventory inventory) {
    ProductVariant variant = inventory.getVariant();
    String status =
        inventory.getAvailable() == 0
            ? "OUT OF STOCK"
            : inventory.getAvailable() <= 5 ? "LOW STOCK" : "IN STOCK";
    return new AdminInventoryResponse(
        inventory.getId(),
        variant.getId(),
        variant.getProduct().getId(),
        variant.getProduct().getName(),
        variant.getColor(),
        variant.getStorage(),
        variant.getPrice(),
        inventory.getQuantity(),
        inventory.getReserved(),
        inventory.getAvailable(),
        status);
  }
}
