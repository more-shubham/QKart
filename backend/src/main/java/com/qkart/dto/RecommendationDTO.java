package com.qkart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationDTO {
    private String type;
    private String title;
    private String description;
    private List<ProductDTO> products;
}
