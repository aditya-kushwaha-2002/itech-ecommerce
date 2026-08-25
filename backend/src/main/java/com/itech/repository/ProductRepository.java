package com.itech.repository;

import com.itech.entity.Product;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
  List<Product> findByNameContainingIgnoreCaseOrBrandContainingIgnoreCase(
      String name, String brand);

  long countByCategoryId(Long categoryId);
}
