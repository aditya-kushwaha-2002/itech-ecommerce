package com.itech.service;

import com.itech.dto.CartItemResponse;
import com.itech.dto.CartResponse;
import com.itech.entity.AppUser;
import com.itech.entity.Cart;
import com.itech.entity.CartItem;
import com.itech.repository.AppUserRepository;
import com.itech.repository.CartRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class CartService {

  private final CartRepository cartRepository;
  private final AppUserRepository userRepository;

  public CartService(CartRepository cartRepository, AppUserRepository userRepository) {
    this.cartRepository = cartRepository;
    this.userRepository = userRepository;
  }

  public CartResponse createCart(Long userId) {
    Cart existingCart = cartRepository.findByUserId(userId).orElse(null);
    if (existingCart != null) return convertToResponse(existingCart);

    Cart cart = new Cart();
    AppUser user =
        userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
    cart.setUser(user);

    Cart savedCart = cartRepository.save(cart);

    return convertToResponse(savedCart);
  }

  public CartResponse getCart(Long cartId, Long userId) {

    Cart cart =
        cartRepository.findById(cartId).orElseThrow(() -> new RuntimeException("Cart not found"));
    assertOwner(cart, userId);

    return convertToResponse(cart);
  }

  private void assertOwner(Cart cart, Long userId) {
    if (cart.getUser() == null || !cart.getUser().getId().equals(userId)) {
      throw new RuntimeException("Cart does not belong to this user");
    }
  }

  private CartResponse convertToResponse(Cart cart) {

    List<CartItemResponse> items =
        cart.getItems().stream().map(this::convertItemToResponse).toList();

    return new CartResponse(cart.getId(), items);
  }

  private CartItemResponse convertItemToResponse(CartItem item) {

    return new CartItemResponse(
        item.getId(),
        item.getVariant().getId(),
        item.getVariant().getColor(),
        item.getVariant().getStorage(),
        item.getVariant().getPrice(),
        item.getQuantity(),
        item.getVariant().getProduct().getName(),
        item.getVariant().getProduct().getBrand(),
        item.getVariant().getProduct().getImageUrl());
  }
}
