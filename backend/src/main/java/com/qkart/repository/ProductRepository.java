package com.qkart.repository;

import com.qkart.model.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    List<Product> findByCategory(String category);

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchProducts(@Param("query") String query);

    List<Product> findByCategoryAndStockGreaterThan(String category, Integer stock);

    @Query("SELECT DISTINCT p.category FROM Product p")
    List<String> findAllCategories();

    @Query("SELECT MIN(p.price) FROM Product p")
    BigDecimal findMinPrice();

    @Query("SELECT MAX(p.price) FROM Product p")
    BigDecimal findMaxPrice();

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY p.name LIMIT 10")
    List<Product> findSuggestions(@Param("query") String query);

    List<Product> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
