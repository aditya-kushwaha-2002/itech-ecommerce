package com.itech.repository;

import com.itech.entity.ProductVariant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

  List<ProductVariant> findByProductId(Long productId);

  boolean existsByProductIdAndColorIgnoreCaseAndStorageIgnoreCase(
      Long productId, String color, String storage);
}
