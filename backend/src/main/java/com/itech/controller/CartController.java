package com.itech.controller;

import com.itech.config.AuthUser;
import com.itech.dto.CartResponse;
import com.itech.service.CartService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carts")
public class CartController {

  private final CartService cartService;

  public CartController(CartService cartService) {
    this.cartService = cartService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public CartResponse createCart(HttpServletRequest request) {

    return cartService.createCart(authUser(request).id());
  }

  @GetMapping("/{cartId}")
  public CartResponse getCart(@PathVariable Long cartId, HttpServletRequest request) {

    return cartService.getCart(cartId, authUser(request).id());
  }

  private AuthUser authUser(HttpServletRequest request) {
    
    return (AuthUser) request.getAttribute("authUser");
  }
}
