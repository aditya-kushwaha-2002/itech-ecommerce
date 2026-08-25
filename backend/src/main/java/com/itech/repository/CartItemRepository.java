package com.itech.repository;

import com.itech.entity.Cart;
import com.itech.entity.CartItem;
import com.itech.entity.ProductVariant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

  Optional<CartItem> findByCartIdAndVariantId(Long cartId, Long variantId);

  List<CartItem> findByCartId(Long cartId);

  Optional<CartItem> findByCartAndVariant(Cart cart, ProductVariant variant);

  void deleteByCart(Cart cart);
}
