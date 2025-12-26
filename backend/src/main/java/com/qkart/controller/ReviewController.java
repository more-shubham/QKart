package com.qkart.controller;

import com.qkart.dto.CreateReviewRequest;
import com.qkart.dto.ProductRatingSummary;
import com.qkart.dto.ReviewDTO;
import com.qkart.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<Page<ReviewDTO>> getProductReviews(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "newest") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId, sortBy, page, size));
    }

    @GetMapping("/product/{productId}/summary")
    public ResponseEntity<ProductRatingSummary> getProductRatingSummary(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductRatingSummary(productId));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<ReviewDTO> createReview(
            @PathVariable Long userId,
            @Valid @RequestBody CreateReviewRequest request) {
        return ResponseEntity.ok(reviewService.createReview(userId, request));
    }

    @PutMapping("/user/{userId}/{reviewId}")
    public ResponseEntity<ReviewDTO> updateReview(
            @PathVariable Long userId,
            @PathVariable Long reviewId,
            @Valid @RequestBody CreateReviewRequest request) {
        return ResponseEntity.ok(reviewService.updateReview(userId, reviewId, request));
    }

    @DeleteMapping("/user/{userId}/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long userId,
            @PathVariable Long reviewId) {
        reviewService.deleteReview(userId, reviewId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{reviewId}/helpful")
    public ResponseEntity<Void> markHelpful(@PathVariable Long reviewId) {
        reviewService.markHelpful(reviewId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewDTO>> getUserReviews(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getUserReviews(userId));
    }
}
