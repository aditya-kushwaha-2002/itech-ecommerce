package com.itech.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {

  private Long id;
  private String status;
  private String paymentMethod;
  private String paymentStatus;
  private LocalDateTime createdAt;
  private String shippingName;
  private String shippingPhone;
  private String shippingAddressLine1;
  private String shippingAddressLine2;
  private String shippingCity;
  private String shippingState;
  private String shippingPostalCode;
  private String shippingCountry;
  private BigDecimal totalAmount;
  private List<OrderItemResponse> items;
  private String customerName;
  private String customerEmail;

  public OrderResponse(
      Long id,
      String status,
      String paymentMethod,
      String paymentStatus,
      LocalDateTime createdAt,
      String shippingName,
      String shippingPhone,
      String shippingAddressLine1,
      String shippingAddressLine2,
      String shippingCity,
      String shippingState,
      String shippingPostalCode,
      String shippingCountry,
      BigDecimal totalAmount,
      List<OrderItemResponse> items) {

    this.id = id;
    this.status = status;
    this.paymentMethod = paymentMethod;
    this.paymentStatus = paymentStatus;
    this.createdAt = createdAt;
    this.shippingName = shippingName;
    this.shippingPhone = shippingPhone;
    this.shippingAddressLine1 = shippingAddressLine1;
    this.shippingAddressLine2 = shippingAddressLine2;
    this.shippingCity = shippingCity;
    this.shippingState = shippingState;
    this.shippingPostalCode = shippingPostalCode;
    this.shippingCountry = shippingCountry;
    this.totalAmount = totalAmount;
    this.items = items;
  }

  public Long getId() {
    return id;
  }

  public String getStatus() {
    return status;
  }

  public String getPaymentMethod() {
    return paymentMethod;
  }

  public String getPaymentStatus() {
    return paymentStatus;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public String getShippingName() {
    return shippingName;
  }

  public String getShippingPhone() {
    return shippingPhone;
  }

  public String getShippingAddressLine1() {
    return shippingAddressLine1;
  }

  public String getShippingAddressLine2() {
    return shippingAddressLine2;
  }

  public String getShippingCity() {
    return shippingCity;
  }

  public String getShippingState() {
    return shippingState;
  }

  public String getShippingPostalCode() {
    return shippingPostalCode;
  }

  public String getShippingCountry() {
    return shippingCountry;
  }

  public BigDecimal getTotalAmount() {
    return totalAmount;
  }

  public List<OrderItemResponse> getItems() {
    return items;
  }

  public String getCustomerName() {
    return customerName;
  }

  public String getCustomerEmail() {
    return customerEmail;
  }

  public void setCustomer(String name, String email) {
    this.customerName = name;
    this.customerEmail = email;
  }
}
