package com.itech.dto;

public class InventoryResponse {

  private Long id;

  private Long variantId;

  private Integer quantity;

  private Integer reserved;

  private Integer available;

  public InventoryResponse(
      Long id, Long variantId, Integer quantity, Integer reserved, Integer available) {
    this.id = id;
    this.variantId = variantId;
    this.quantity = quantity;
    this.reserved = reserved;
    this.available = available;
  }

  public Long getId() {
    return id;
  }

  public Long getVariantId() {
    return variantId;
  }

  public Integer getQuantity() {
    return quantity;
  }

  public Integer getReserved() {
    return reserved;
  }

  public Integer getAvailable() {
    return available;
  }
}
