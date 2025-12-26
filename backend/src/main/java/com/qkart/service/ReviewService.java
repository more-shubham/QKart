package com.qkart.service;

import com.qkart.dto.CreateReviewRequest;
import com.qkart.dto.ProductRatingSummary;
import com.qkart.dto.ReviewDTO;
import com.qkart.exception.BadRequestException;
import com.qkart.exception.ResourceNotFoundException;
import com.qkart.model.Product;
import com.qkart.model.Review;
import com.qkart.model.User;
import com.qkart.repository.OrderRepository;
import com.qkart.repository.ProductRepository;
import com.qkart.repository.ReviewRepository;
import com.qkart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public Page<ReviewDTO> getProductReviews(Long productId, String sortBy, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Review> reviews = switch (sortBy != null ? sortBy.toLowerCase() : "newest") {
            case "highest" -> reviewRepository.findByProductIdOrderByRatingDesc(productId, pageable);
            case "helpful" -> reviewRepository.findByProductIdOrderByHelpfulCountDesc(productId, pageable);
            default -> reviewRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable);
        };

        return reviews.map(this::toDTO);
    }

    public ProductRatingSummary getProductRatingSummary(Long productId) {
        Double avgRating = reviewRepository.getAverageRatingByProductId(productId);
        Long totalReviews = reviewRepository.getReviewCountByProductId(productId);
        List<Object[]> distribution = reviewRepository.getRatingDistributionByProductId(productId);

        Map<Integer, Long> ratingDistribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            ratingDistribution.put(i, 0L);
        }
        for (Object[] row : distribution) {
            Integer rating = (Integer) row[0];
            Long count = (Long) row[1];
            ratingDistribution.put(rating, count);
        }

        return ProductRatingSummary.builder()
                .averageRating(avgRating != null ? avgRating : 0.0)
                .totalReviews(totalReviews != null ? totalReviews : 0L)
                .ratingDistribution(ratingDistribution)
                .build();
    }

    @Transactional
    public ReviewDTO createReview(Long userId, CreateReviewRequest request) {
        // Check if user already reviewed this product
        if (reviewRepository.existsByUserIdAndProductId(userId, request.getProductId())) {
            throw new BadRequestException("You have already reviewed this product");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Check if user has purchased this product (verified purchase)
        boolean verifiedPurchase = orderRepository.existsByUserIdAndProductId(userId, request.getProductId());

        Review review = Review.builder()
                .user(user)
                .product(product)
                .rating(request.getRating())
                .title(request.getTitle())
                .comment(request.getComment())
                .verifiedPurchase(verifiedPurchase)
                .build();

        Review saved = reviewRepository.save(review);

        // Update product rating
        updateProductRating(product);

        return toDTO(saved);
    }

    @Transactional
    public ReviewDTO updateReview(Long userId, Long reviewId, CreateReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only edit your own reviews");
        }

        review.setRating(request.getRating());
        review.setTitle(request.getTitle());
        review.setComment(request.getComment());

        Review saved = reviewRepository.save(review);

        // Update product rating
        updateProductRating(review.getProduct());

        return toDTO(saved);
    }

    @Transactional
    public void deleteReview(Long userId, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only delete your own reviews");
        }

        Product product = review.getProduct();
        reviewRepository.delete(review);

        // Update product rating
        updateProductRating(product);
    }

    @Transactional
    public void markHelpful(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        review.setHelpfulCount(review.getHelpfulCount() + 1);
        reviewRepository.save(review);
    }

    public List<ReviewDTO> getUserReviews(Long userId) {
        return reviewRepository.findByUserId(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private void updateProductRating(Product product) {
        Double avgRating = reviewRepository.getAverageRatingByProductId(product.getId());
        Long reviewCount = reviewRepository.getReviewCountByProductId(product.getId());

        product.setRating(avgRating != null ? avgRating : 0.0);
        product.setReviewCount(reviewCount != null ? reviewCount.intValue() : 0);
        productRepository.save(product);
    }

    private ReviewDTO toDTO(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .productId(review.getProduct().getId())
                .userId(review.getUser().getId())
                .userName(review.getUser().getName())
                .rating(review.getRating())
                .title(review.getTitle())
                .comment(review.getComment())
                .verifiedPurchase(review.getVerifiedPurchase())
                .helpfulCount(review.getHelpfulCount())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
