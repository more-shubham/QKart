package com.qkart.repository;

import com.qkart.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByProductIdOrderByCreatedAtDesc(Long productId, Pageable pageable);

    Page<Review> findByProductIdOrderByRatingDesc(Long productId, Pageable pageable);

    Page<Review> findByProductIdOrderByHelpfulCountDesc(Long productId, Pageable pageable);

    List<Review> findByProductId(Long productId);

    Optional<Review> findByUserIdAndProductId(Long userId, Long productId);

    boolean existsByUserIdAndProductId(Long userId, Long productId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double getAverageRatingByProductId(@Param("productId") Long productId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId")
    Long getReviewCountByProductId(@Param("productId") Long productId);

    @Query("SELECT r.rating, COUNT(r) FROM Review r WHERE r.product.id = :productId GROUP BY r.rating ORDER BY r.rating DESC")
    List<Object[]> getRatingDistributionByProductId(@Param("productId") Long productId);

    List<Review> findByUserId(Long userId);
}
