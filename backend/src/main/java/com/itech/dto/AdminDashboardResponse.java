package com.itech.dto;

import java.math.BigDecimal;

public record AdminDashboardResponse(
    long totalProducts,
    long totalVariants,
    long lowStockVariants,
    long totalOrders,
    long pendingOrders,
    long confirmedOrders,
    long shippedOrders,
    long completedOrders,
    BigDecimal totalRevenue) {}
