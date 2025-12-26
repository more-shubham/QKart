package com.qkart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private Long id;
    private Long productId;
    private Long userId;
    private String userName;
    private Integer rating;
    private String title;
    private String comment;
    private Boolean verifiedPurchase;
    private Integer helpfulCount;
    private LocalDateTime createdAt;
}
