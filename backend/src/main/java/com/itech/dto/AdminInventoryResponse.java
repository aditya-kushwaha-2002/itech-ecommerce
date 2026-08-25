package com.itech.dto;

import java.math.BigDecimal;

public record AdminInventoryResponse(
    Long id,
    Long variantId,
    Long productId,
    String productName,
    String color,
    String storage,
    BigDecimal price,
    Integer quantity,
    Integer reserved,
    Integer available,
    String stockStatus) {
        
    }
