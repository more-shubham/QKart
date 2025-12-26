package com.qkart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductRatingSummary {
    private Double averageRating;
    private Long totalReviews;
    private Map<Integer, Long> ratingDistribution; // Rating (1-5) -> Count
}
