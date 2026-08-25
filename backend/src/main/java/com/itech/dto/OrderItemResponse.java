package com.itech.dto;

import java.math.BigDecimal;

public class OrderItemResponse {

  private Long id;
  private Long variantId;
  private String color;
  private String storage;
  private BigDecimal price;
  private Integer quantity;
  private String productName;
  private String brand;
  private String imageUrl;

  public OrderItemResponse(
      Long id, Long variantId, String color, String storage, BigDecimal price, Integer quantity) {

    this.id = id;
    this.variantId = variantId;
    this.color = color;
    this.storage = storage;
    this.price = price;
    this.quantity = quantity;
  }

  public OrderItemResponse(
      Long id,
      Long variantId,
      String color,
      String storage,
      BigDecimal price,
      Integer quantity,
      String productName,
      String brand,
      String imageUrl) {
        
    this(id, variantId, color, storage, price, quantity);
    this.productName = productName;
    this.brand = brand;
    this.imageUrl = imageUrl;
  }

  public Long getId() {
    return id;
  }

  public Long getVariantId() {
    return variantId;
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

  public Integer getQuantity() {
    return quantity;
  }

  public String getProductName() {
    return productName;
  }

  public String getBrand() {
    return brand;
  }

  public String getImageUrl() {
    return imageUrl;
  }
}
