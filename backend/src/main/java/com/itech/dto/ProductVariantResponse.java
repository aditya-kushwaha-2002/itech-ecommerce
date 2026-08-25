package com.itech.dto;

import java.math.BigDecimal;

public class ProductVariantResponse {

  private Long id;

  private String color;

  private String storage;

  private BigDecimal price;

  private Long productId;

  public ProductVariantResponse(
      Long id, String color, String storage, BigDecimal price, Long productId) {
        
    this.id = id;
    this.color = color;
    this.storage = storage;
    this.price = price;
    this.productId = productId;
  }

  public Long getId() {
    return id;
  }

  public String getColor() {
    return color;
  }

  public String getStorage() {
    return storage;
  }

  public BigDecimal getPrice() {
    return price;
  }

  public Long getProductId() {
    return productId;
  }
}
