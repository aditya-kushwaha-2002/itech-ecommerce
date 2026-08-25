package com.itech.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  private AppUser user;

  @Column(nullable = false)
  private BigDecimal totalAmount;

  @Column(nullable = false)
  private String status;

  @Column(nullable = false)
  private String paymentMethod;

  @Column(nullable = false)
  private String paymentStatus;

  private String shippingName;
  private String shippingPhone;
  private String shippingAddressLine1;
  private String shippingAddressLine2;
  private String shippingCity;
  private String shippingState;
  private String shippingPostalCode;
  private String shippingCountry;

  @Column(nullable = false)
  private LocalDateTime createdAt;

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<OrderItem> items = new ArrayList<>();

  public Order() {}

  @PrePersist
  public void onCreate() {
    createdAt = LocalDateTime.now();
  }

  public Long getId() {
    return id;
  }

  public BigDecimal getTotalAmount() {
    return totalAmount;
  }

  public void setTotalAmount(BigDecimal totalAmount) {
    this.totalAmount = totalAmount;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public AppUser getUser() {
    return user;
  }

  public void setUser(AppUser user) {
    this.user = user;
  }

  public String getPaymentMethod() {
    return paymentMethod;
  }

  public void setPaymentMethod(String paymentMethod) {
    this.paymentMethod = paymentMethod;
  }

  public String getPaymentStatus() {
    return paymentStatus;
  }

  public void setPaymentStatus(String paymentStatus) {
    this.paymentStatus = paymentStatus;
  }

  public void setShippingName(String value) {
    shippingName = value;
  }

  public void setShippingPhone(String value) {
    shippingPhone = value;
  }

  public void setShippingAddressLine1(String value) {
    shippingAddressLine1 = value;
  }

  public void setShippingAddressLine2(String value) {
    shippingAddressLine2 = value;
  }

  public void setShippingCity(String value) {
    shippingCity = value;
  }

  public void setShippingState(String value) {
    shippingState = value;
  }

  public void setShippingPostalCode(String value) {
    shippingPostalCode = value;
  }

  public void setShippingCountry(String value) {
    shippingCountry = value;
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

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public List<OrderItem> getItems() {
    return items;
  }

  public void addItem(OrderItem item) {
    items.add(item);
    item.setOrder(this);
  }

  public void removeItem(OrderItem item) {
    items.remove(item);
    item.setOrder(null);
  }
}
