package com.qkart.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public class ApplyCouponRequest {

    @NotBlank(message = "Coupon code is required")
    private String code;

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Order amount is required")
    @Positive(message = "Order amount must be positive")
    private BigDecimal orderAmount;

    // Getters and Setters
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public BigDecimal getOrderAmount() {
        return orderAmount;
    }

    public void setOrderAmount(BigDecimal orderAmount) {
        this.orderAmount = orderAmount;
    }
}
