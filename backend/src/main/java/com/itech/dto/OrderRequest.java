package com.itech.dto;

public class OrderRequest {

  private Long cartId;

  public OrderRequest() {}

  public Long getCartId() {
    return cartId;
  }

  public void setCartId(Long cartId) {
    this.cartId = cartId;
  }
}
