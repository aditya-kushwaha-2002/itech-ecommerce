package com.itech.service;

import com.itech.dto.CartItemRequest;
import com.itech.dto.CartItemResponse;
import com.itech.entity.Cart;
import com.itech.entity.CartItem;
import com.itech.entity.ProductVariant;
import com.itech.repository.CartItemRepository;
import com.itech.repository.CartRepository;
import com.itech.repository.InventoryRepository;
import com.itech.repository.ProductVariantRepository;
import org.springframework.stereotype.Service;

@Service
public class CartItemService {

  private final CartRepository cartRepository;
  private final CartItemRepository cartItemRepository;
  private final ProductVariantRepository productVariantRepository;
  private final InventoryRepository inventoryRepository;

  public CartItemService(
      CartRepository cartRepository,
      CartItemRepository cartItemRepository,
      ProductVariantRepository productVariantRepository,
      InventoryRepository inventoryRepository) {

    this.cartRepository = cartRepository;
    this.cartItemRepository = cartItemRepository;
    this.productVariantRepository = productVariantRepository;
    this.inventoryRepository = inventoryRepository;
  }

  public CartItemResponse addItem(Long cartId, CartItemRequest request, Long userId) {

    Cart cart =
        cartRepository.findById(cartId).orElseThrow(() -> new RuntimeException("Cart not found"));
    assertOwner(cart, userId);

    ProductVariant variant =
        productVariantRepository
            .findById(request.getVariantId())
            .orElseThrow(() -> new RuntimeException("Product variant not found"));

    CartItem item = cartItemRepository.findByCartAndVariant(cart, variant).orElse(null);

    if (item != null) {

      int newQuantity = item.getQuantity() + request.getQuantity();
      validateAvailableInventory(variant.getId(), newQuantity);
      item.setQuantity(newQuantity);

    } else {

      validateAvailableInventory(variant.getId(), request.getQuantity());

      item = new CartItem();

      item.setVariant(variant);
      item.setQuantity(request.getQuantity());

      cart.addItem(item);
    }

    CartItem savedItem = cartItemRepository.save(item);

    return convertToResponse(savedItem);
  }

  public CartItemResponse updateQuantity(Long cartId, Long itemId, Integer quantity, Long userId) {

    Cart cart =
        cartRepository.findById(cartId).orElseThrow(() -> new RuntimeException("Cart not found"));
    assertOwner(cart, userId);

    CartItem item =
        cartItemRepository
            .findById(itemId)
            .orElseThrow(() -> new RuntimeException("Cart item not found"));

    if (!item.getCart().getId().equals(cart.getId())) {

      throw new RuntimeException("Cart item does not belong to this cart");
    }

    if (quantity == null || quantity <= 0) {

      throw new RuntimeException("Quantity must be greater than 0");
    }

    validateAvailableInventory(item.getVariant().getId(), quantity);
    item.setQuantity(quantity);

    CartItem savedItem = cartItemRepository.save(item);

    return convertToResponse(savedItem);
  }

  public void removeItem(Long cartId, Long itemId, Long userId) {

    Cart cart =
        cartRepository.findById(cartId).orElseThrow(() -> new RuntimeException("Cart not found"));
    assertOwner(cart, userId);

    CartItem item =
        cartItemRepository
            .findById(itemId)
            .orElseThrow(() -> new RuntimeException("Cart item not found"));

    if (!item.getCart().getId().equals(cart.getId())) {
      throw new RuntimeException("Cart item does not belong to this cart");
    }

    cartItemRepository.delete(item);
  }

  public void clearCart(Long cartId, Long userId) {

    Cart cart =
        cartRepository.findById(cartId).orElseThrow(() -> new RuntimeException("Cart not found"));
    assertOwner(cart, userId);

    cartItemRepository.deleteByCart(cart);
  }

  private CartItemResponse convertToResponse(CartItem item) {

    ProductVariant variant = item.getVariant();

    return new CartItemResponse(
        item.getId(),
        variant.getId(),
        variant.getColor(),
        variant.getStorage(),
        variant.getPrice(),
        item.getQuantity(),
        variant.getProduct().getName(),
        variant.getProduct().getBrand(),
        variant.getProduct().getImageUrl());
  }

  private void assertOwner(Cart cart, Long userId) {
    if (cart.getUser() == null || !cart.getUser().getId().equals(userId)) {
      throw new RuntimeException("Cart does not belong to this user");
    }
  }

  private void validateAvailableInventory(Long variantId, Integer requestedQuantity) {
    var inventory =
        inventoryRepository
            .findByVariantId(variantId)
            .orElseThrow(
                () -> new RuntimeException("Inventory not found for this product variant"));
    if (requestedQuantity > inventory.getAvailable()) {
      throw new RuntimeException("Requested quantity exceeds available inventory");
    }
  }
}
