package com.itech.service;

import com.itech.dto.AdminDashboardResponse;
import com.itech.repository.InventoryRepository;
import com.itech.repository.OrderRepository;
import com.itech.repository.ProductRepository;
import com.itech.repository.ProductVariantRepository;
import java.math.BigDecimal;
import org.springframework.stereotype.Service;

@Service
public class AdminDashboardService {
  private final ProductRepository products;
  private final ProductVariantRepository variants;
  private final InventoryRepository inventory;
  private final OrderRepository orders;

  public AdminDashboardService(
      ProductRepository products,
      ProductVariantRepository variants,
      InventoryRepository inventory,
      OrderRepository orders) {

    this.products = products;
    this.variants = variants;
    this.inventory = inventory;
    this.orders = orders;
  }

  public AdminDashboardResponse getDashboard() {
    var allOrders = orders.findAll();

    BigDecimal revenue =
        allOrders.stream()
            .filter(order -> !"CANCELLED".equals(order.getStatus()))
            .map(order -> order.getTotalAmount())
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    long lowStock = inventory
                        .findAll()
                        .stream()
                        .filter(item -> 
                            item.getAvailable() <= 5)
                            .count();

    long pending = allOrders
                    .stream()
                    .filter(order -> "PLACED"
                        .equals(order.getStatus()))
                    .count();

    long confirmed = allOrders
                        .stream()
                        .filter(order -> "CONFIRMED"
                            .equals(order.getStatus()))
                        .count();

    long shipped = allOrders
                    .stream()
                    .filter(order -> "SHIPPED"
                        .equals(order.getStatus()))
                    .count();

    long completed =
        allOrders
            .stream()
            .filter(order -> "DELIVERED"
                .equals(order.getStatus()))
            .count();

    return new AdminDashboardResponse(
        products.count(),
        variants.count(),
        lowStock,
        allOrders.size(),
        pending,
        confirmed,
        shipped,
        completed,
        revenue);
    }
}
