package com.itech.dto;

import java.math.BigDecimal;

public class ProductResponse {

  private Long id;
  private String name;
  private String brand;
  private String description;
  private BigDecimal price;
  private Double discount;
  private String imageUrl;

  private Long categoryId;
  private String categoryName;

  public ProductResponse(
      Long id,
      String name,
      String brand,
      String description,
      BigDecimal price,
      Double discount,
      String imageUrl,
      Long categoryId,
      String categoryName) {

    this.id = id;
    this.name = name;
    this.brand = brand;
    this.description = description;
    this.price = price;
    this.discount = discount;
    this.imageUrl = imageUrl;
    this.categoryId = categoryId;
    this.categoryName = categoryName;
  }

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getBrand() {
    return brand;
  }

  public String getDescription() {
    return description;
  }

  public BigDecimal getPrice() {
    return price;
  }

  public Double getDiscount() {
    return discount;
  }

  public Long getCategoryId() {
    return categoryId;
  }

  public String getCategoryName() {
    return categoryName;
  }

  public String getImageUrl() {
    return imageUrl;
  }
}
