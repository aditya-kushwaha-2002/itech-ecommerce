package com.itech.service;

import com.itech.dto.OrderItemResponse;
import com.itech.dto.OrderResponse;
import com.itech.entity.AppUser;
import com.itech.entity.Cart;
import com.itech.entity.CartItem;
import com.itech.entity.Order;
import com.itech.entity.OrderItem;
import com.itech.entity.ProductVariant;
import com.itech.exception.ApiException;
import com.itech.repository.AppUserRepository;
import com.itech.repository.CartRepository;
import com.itech.repository.InventoryRepository;
import com.itech.repository.OrderRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

  private final CartRepository cartRepository;
  private final OrderRepository orderRepository;
  private final InventoryRepository inventoryRepository;
  private final AppUserRepository userRepository;

  public OrderService(
      CartRepository cartRepository,
      OrderRepository orderRepository,
      InventoryRepository inventoryRepository,
      AppUserRepository userRepository) {

    this.cartRepository = cartRepository;
    this.orderRepository = orderRepository;
    this.inventoryRepository = inventoryRepository;
    this.userRepository = userRepository;
  }

  // ================= CREATE ORDER =================

  @Transactional
  public OrderResponse createOrder(Long cartId, String requestedPaymentMethod, Long userId) {

    Cart cart =
        cartRepository.findById(cartId).orElseThrow(() -> new RuntimeException("Cart not found"));
    if (cart.getUser() == null || !cart.getUser().getId().equals(userId)) {
      throw new RuntimeException("Cart does not belong to this user");
    }

    if (cart.getItems() == null || cart.getItems().isEmpty()) {
      throw new RuntimeException("Cart is empty");
    }

    Order order = new Order();
    AppUser user =
        userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
    order.setUser(user);

    if (isBlank(user.getPhone())
        || isBlank(user.getAddressLine1())
        || isBlank(user.getCity())
        || isBlank(user.getState())
        || isBlank(user.getPostalCode())
        || isBlank(user.getCountry())) {
      throw new RuntimeException(
          "Please save your complete delivery address in your profile before checkout");
    }

    order.setShippingName(user.getName());
    order.setShippingPhone(user.getPhone());
    order.setShippingAddressLine1(user.getAddressLine1());
    order.setShippingAddressLine2(user.getAddressLine2());
    order.setShippingCity(user.getCity());
    order.setShippingState(user.getState());
    order.setShippingPostalCode(user.getPostalCode());
    order.setShippingCountry(user.getCountry());

    order.setStatus("PLACED");

    String paymentMethod =
        requestedPaymentMethod == null ? "COD" : requestedPaymentMethod.trim().toUpperCase();

    if (!paymentMethod.equals("COD") && !paymentMethod.equals("ONLINE")) {
      throw ApiException.badRequest("Payment method must be COD or ONLINE");
    }

    order.setPaymentMethod(paymentMethod);
    // ONLINE is intentionally a demo payment until a real gateway is configured.
    order.setPaymentStatus(paymentMethod.equals("ONLINE") ? "PAID" : "PENDING");

    BigDecimal totalAmount = BigDecimal.ZERO;

    for (CartItem cartItem : cart.getItems()) {

      ProductVariant variant = cartItem.getVariant();

      var inventory =
          inventoryRepository
              .findByVariantId(variant.getId())
              .orElseThrow(
                  () -> new RuntimeException("Inventory not found for variant " + variant.getId()));

      if (inventory.getAvailable() < cartItem.getQuantity()) {
        throw ApiException.conflict(
            "Insufficient stock for " + variant.getColor() + " / " + variant.getStorage());
      }

      OrderItem orderItem = new OrderItem();

      orderItem.setVariant(variant);
      orderItem.setQuantity(cartItem.getQuantity());
      orderItem.setPrice(variant.getPrice());

      // Order <-> OrderItem connection
      order.addItem(orderItem);

      BigDecimal itemTotal =
          variant.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));

      totalAmount = totalAmount.add(itemTotal);

      inventory.setQuantity(inventory.getQuantity() - cartItem.getQuantity());
    }

    order.setTotalAmount(totalAmount);

    Order savedOrder = orderRepository.save(order);

    // A placed order owns its item snapshot; the active cart becomes empty.
    cart.getItems().clear();

    return convertToResponse(savedOrder);
  }

  // ================= GET ORDER =================

  public OrderResponse getOrder(Long orderId, Long userId, boolean admin) {

    Order order =
        orderRepository
            .findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
    if (!admin && (order.getUser() == null || !order.getUser().getId().equals(userId))) {
      throw new RuntimeException("Order does not belong to this user");
    }

    return convertToResponse(order);
  }

  public List<OrderResponse> getOrdersForUser(Long userId) {
    return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
        .map(this::convertToResponse)
        .toList();
  }

  public List<OrderResponse> getAllOrders() {
    return orderRepository.findAll().stream()
        .sorted((first, second) -> second.getCreatedAt().compareTo(first.getCreatedAt()))
        .map(this::convertToResponse)
        .toList();
  }

  @Transactional
  public OrderResponse updateStatus(Long orderId, String requestedStatus) {

    Order order =
        orderRepository
            .findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

    String status = requestedStatus == null ? "" : requestedStatus.trim().toUpperCase();

    if (!List.of("CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED").contains(status)) {
      throw ApiException.badRequest(
          "Order status must be CONFIRMED, SHIPPED, DELIVERED, or CANCELLED");
    }

    String current = order.getStatus();

    boolean valid =
        switch (current) {
          case "PLACED" -> status.equals("CONFIRMED") || status.equals("CANCELLED");
          case "CONFIRMED" -> status.equals("SHIPPED") || status.equals("CANCELLED");
          case "SHIPPED" -> status.equals("DELIVERED");
          default -> false;
        };

    if (!valid)
      throw ApiException.badRequest(
          "Invalid order status transition from " + current + " to " + status);

    if (status.equals("CANCELLED")) restoreInventory(order);

    order.setStatus(status);

    return convertToResponse(orderRepository.save(order));
  }

  @Transactional
  public OrderResponse cancelOrder(Long orderId, Long userId) {

    Order order =
        orderRepository
            .findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

    if (order.getUser() == null || !order.getUser().getId().equals(userId))
      throw new RuntimeException("Order does not belong to this user");

    if (!("PLACED".equals(order.getStatus())))
      throw ApiException.badRequest("Only a placed order can be cancelled");

    restoreInventory(order);

    order.setStatus("CANCELLED");

    return convertToResponse(orderRepository.save(order));
  }

  private void restoreInventory(Order order) {

    for (OrderItem item : order.getItems()) {
      var inventory =
          inventoryRepository
              .findByVariantId(item.getVariant().getId())
              .orElseThrow(
                  () -> new RuntimeException("Inventory not found for cancelled order item"));

      inventory.setQuantity(inventory.getQuantity() + item.getQuantity());
    }
  }

  // ================= RESPONSE =================

  private OrderResponse convertToResponse(Order order) {

    List<OrderItemResponse> items =
        order.getItems().stream().map(this::convertItemToResponse).toList();

    OrderResponse response =
        new OrderResponse(
            order.getId(),
            order.getStatus(),
            order.getPaymentMethod(),
            order.getPaymentStatus(),
            order.getCreatedAt(),
            order.getShippingName(),
            order.getShippingPhone(),
            order.getShippingAddressLine1(),
            order.getShippingAddressLine2(),
            order.getShippingCity(),
            order.getShippingState(),
            order.getShippingPostalCode(),
            order.getShippingCountry(),
            order.getTotalAmount(),
            items);

    if (order.getUser() != null)
      response.setCustomer(order.getUser().getName(), order.getUser().getEmail());

    return response;
  }

  private boolean isBlank(String value) {
    
    return value == null || value.isBlank();
  }

  private OrderItemResponse convertItemToResponse(OrderItem item) {

    ProductVariant variant = item.getVariant();

    return new OrderItemResponse(
        item.getId(),
        variant.getId(),
        variant.getColor(),
        variant.getStorage(),
        item.getPrice(),
        item.getQuantity(),
        variant.getProduct().getName(),
        variant.getProduct().getBrand(),
        variant.getProduct().getImageUrl());
  }
}
