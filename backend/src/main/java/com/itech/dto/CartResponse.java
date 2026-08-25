package com.itech.dto;

import java.util.List;

public class CartResponse {

  private Long id;
  private List<CartItemResponse> items;

  public CartResponse() {}

  public CartResponse(Long id, List<CartItemResponse> items) {
    this.id = id;
    this.items = items;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public List<CartItemResponse> getItems() {
    return items;
  }

  public void setItems(List<CartItemResponse> items) {
    this.items = items;
  }
}
