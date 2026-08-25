package com.itech.controller;

import com.itech.config.AuthUser;
import com.itech.dto.CartItemRequest;
import com.itech.dto.CartItemResponse;
import com.itech.service.CartItemService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carts")
public class CartItemController {

  private final CartItemService cartItemService;

  public CartItemController(CartItemService cartItemService) {
    this.cartItemService = cartItemService;
  }

  @PostMapping("/{cartId}/items")
  @ResponseStatus(HttpStatus.CREATED)
  public CartItemResponse addItem(
      @PathVariable Long cartId,
      @Valid @RequestBody CartItemRequest request,
      HttpServletRequest servletRequest) {

    return cartItemService.addItem(cartId, request, authUser(servletRequest).id());
  }

  @PutMapping("/{cartId}/items/{itemId}")
  public CartItemResponse updateQuantity(
      @PathVariable Long cartId,
      @PathVariable Long itemId,
      @Valid @RequestBody CartItemRequest request,
      HttpServletRequest servletRequest) {

    return cartItemService.updateQuantity(
        cartId, itemId, request.getQuantity(), authUser(servletRequest).id());
  }

  @DeleteMapping("/{cartId}/items/{itemId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void removeItem(
      @PathVariable Long cartId, @PathVariable Long itemId, HttpServletRequest servletRequest) {

    cartItemService.removeItem(cartId, itemId, authUser(servletRequest).id());
  }

  @DeleteMapping("/{cartId}/items")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void clearCart(@PathVariable Long cartId, HttpServletRequest servletRequest) {

    cartItemService.clearCart(cartId, authUser(servletRequest).id());
  }

  private AuthUser authUser(HttpServletRequest request) {
    
    return (AuthUser) request.getAttribute("authUser");
  }
}
