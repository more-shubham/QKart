package com.qkart.dto;

import java.math.BigDecimal;

public class CouponValidationResponse {

    private boolean valid;
    private String message;
    private String code;
    private String discountType;
    private BigDecimal discountValue;
    private BigDecimal discountAmount;
    private BigDecimal originalAmount;
    private BigDecimal finalAmount;

    public CouponValidationResponse() {}

    public static CouponValidationResponse invalid(String message) {
        CouponValidationResponse response = new CouponValidationResponse();
        response.setValid(false);
        response.setMessage(message);
        return response;
    }

    public static CouponValidationResponse valid(String code, String discountType,
            BigDecimal discountValue, BigDecimal discountAmount,
            BigDecimal originalAmount, BigDecimal finalAmount) {
        CouponValidationResponse response = new CouponValidationResponse();
        response.setValid(true);
        response.setCode(code);
        response.setDiscountType(discountType);
        response.setDiscountValue(discountValue);
        response.setDiscountAmount(discountAmount);
        response.setOriginalAmount(originalAmount);
        response.setFinalAmount(finalAmount);
        response.setMessage("Coupon applied successfully");
        return response;
    }

    // Getters and Setters
    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDiscountType() {
        return discountType;
    }

    public void setDiscountType(String discountType) {
        this.discountType = discountType;
    }

    public BigDecimal getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(BigDecimal discountValue) {
        this.discountValue = discountValue;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }

    public BigDecimal getOriginalAmount() {
        return originalAmount;
    }

    public void setOriginalAmount(BigDecimal originalAmount) {
        this.originalAmount = originalAmount;
    }

    public BigDecimal getFinalAmount() {
        return finalAmount;
    }

    public void setFinalAmount(BigDecimal finalAmount) {
        this.finalAmount = finalAmount;
    }
}
