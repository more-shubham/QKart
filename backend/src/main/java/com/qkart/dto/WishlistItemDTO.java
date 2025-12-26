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
public class WishlistItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String productImage;
    private Double price;
    private Integer stock;
    private Double rating;
    private LocalDateTime addedAt;
}
