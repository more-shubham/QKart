package com.qkart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSearchCriteria {
    private String query;
    private List<String> categories;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Double minRating;
    private Boolean inStock;
    private String sortBy;      // price, rating, newest, name
    private String sortOrder;   // asc, desc
    private Integer page;
    private Integer size;
}
