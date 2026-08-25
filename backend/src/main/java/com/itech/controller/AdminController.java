package com.itech.controller;

import com.itech.dto.AdminDashboardResponse;
import com.itech.dto.AdminInventoryResponse;
import com.itech.dto.InventoryRequest;
import com.itech.dto.InventoryResponse;
import com.itech.dto.OrderResponse;
import com.itech.dto.OrderStatusRequest;
import com.itech.service.AdminDashboardService;
import com.itech.service.InventoryService;
import com.itech.service.OrderService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

  private final AdminDashboardService dashboard;
  private final OrderService orders;
  private final InventoryService inventory;

  public AdminController(
      AdminDashboardService dashboard, OrderService orders, InventoryService inventory) {

    this.dashboard = dashboard;
    this.orders = orders;
    this.inventory = inventory;
  }

  @GetMapping("/dashboard")
  public AdminDashboardResponse dashboard() {

    return dashboard.getDashboard();
  }

  @PutMapping("/orders/{orderId}/status")
  public OrderResponse updateOrderStatus(
      @PathVariable Long orderId, @RequestBody OrderStatusRequest request) {

    return orders.updateStatus(orderId, request.getStatus());
  }

  @GetMapping("/inventory")
  public List<AdminInventoryResponse> getInventory() {

    return inventory.getAllInventory();
  }

  @PutMapping("/inventory/{variantId}")
  public InventoryResponse updateInventory(
      @PathVariable Long variantId, @Valid @RequestBody InventoryRequest request) {
        
    return inventory.updateInventory(variantId, request);
  }
}
