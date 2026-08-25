package com.itech.config;

import com.itech.entity.*;
import com.itech.repository.*;
import java.math.BigDecimal;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CatalogueSeeder {
  
  @Bean
  CommandLineRunner seedCatalogue(
      CategoryRepository categories,
      ProductRepository products,
      ProductVariantRepository variants,
      InventoryRepository inventory) {

    return args -> {
      if (products.count() > 0) return;
      Category phones = category(categories, "Smartphones"),
          laptops = category(categories, "Laptops"),
          audio = category(categories, "Audio");
      product(
          products,
          variants,
          inventory,
          phones,
          "iTech Nova Pro",
          "iTech",
          "A powerful everyday smartphone with a luminous display.",
          "69999",
          12,
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
          "Midnight",
          "256GB",
          69999,
          18);
      product(
          products,
          variants,
          inventory,
          laptops,
          "iTech Air 14",
          "iTech",
          "Lightweight performance for work, study and creativity.",
          "89999",
          8,
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
          "Silver",
          "512GB",
          89999,
          12);
      product(
          products,
          variants,
          inventory,
          audio,
          "Pulse Max Headphones",
          "Pulse",
          "Immersive wireless audio with all-day comfort.",
          "12999",
          15,
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
          "Space Gray",
          "Wireless",
          12999,
          25);
    };
  }

  private Category category(CategoryRepository r, String name) {

    Category c = new Category();
    c.setName(name);

    return r.save(c);
  }

  private void product(
      ProductRepository pr,
      ProductVariantRepository vr,
      InventoryRepository ir,
      Category c,
      String name,
      String brand,
      String description,
      String price,
      double discount,
      String image,
      String color,
      String storage,
      int variantPrice,
      int stock) {

    Product p = new Product();
    p.setName(name);
    p.setBrand(brand);
    p.setDescription(description);
    p.setPrice(new BigDecimal(price));
    p.setDiscount(discount);
    p.setImageUrl(image);
    p.setCategory(c);
    
    p = pr.save(p);

    ProductVariant v = new ProductVariant();
    v.setProduct(p);
    v.setColor(color);
    v.setStorage(storage);
    v.setPrice(BigDecimal.valueOf(variantPrice));

    v = vr.save(v);

    Inventory i = new Inventory();
    i.setVariant(v);
    i.setQuantity(stock);
    i.setReserved(0);

    ir.save(i);
  }
}
