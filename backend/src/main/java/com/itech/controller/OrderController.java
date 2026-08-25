package com.itech.controller;

import com.itech.config.AuthUser;
import com.itech.dto.OrderResponse;
import com.itech.dto.PaymentRequest;
import com.itech.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

  private final OrderService orderService;

  public OrderController(OrderService orderService) {
    this.orderService = orderService;
  }

  // ================= CREATE ORDER =================

  @PostMapping("/carts/{cartId}")
  @ResponseStatus(HttpStatus.CREATED)
  public OrderResponse createOrder(
      @PathVariable Long cartId,
      @RequestBody(required = false) PaymentRequest request,
      HttpServletRequest servletRequest) {

    return orderService.createOrder(
        cartId,
        request == null ? null : request.getPaymentMethod(),
        ((AuthUser) servletRequest.getAttribute("authUser")).id());
  }

  // ================= GET ORDER =================

  @GetMapping("/{orderId}")
  public OrderResponse getOrder(@PathVariable Long orderId, HttpServletRequest servletRequest) {

    AuthUser user = (AuthUser) servletRequest.getAttribute("authUser");
    return orderService.getOrder(orderId, user.id(), "ADMIN".equals(user.role()));
  }

  @GetMapping("/my")
  public java.util.List<OrderResponse> getMyOrders(HttpServletRequest servletRequest) {
    return orderService.getOrdersForUser(((AuthUser) servletRequest.getAttribute("authUser")).id());
  }

  @PutMapping("/{orderId}/cancel")
  public OrderResponse cancelOrder(@PathVariable Long orderId, HttpServletRequest servletRequest) {
    return orderService.cancelOrder(
        orderId, ((AuthUser) servletRequest.getAttribute("authUser")).id());
  }

  @GetMapping
  public java.util.List<OrderResponse> getAllOrders() {
    return orderService.getAllOrders();
  }
}
