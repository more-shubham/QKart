package com.qkart.dto;

import com.qkart.model.Coupon;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CouponDTO {

    private Long id;
    private String code;
    private String description;
    private String discountType;
    private BigDecimal discountValue;
    private BigDecimal minimumOrderValue;
    private BigDecimal maximumDiscount;
    private Integer usageLimit;
    private Integer usageLimitPerUser;
    private Integer timesUsed;
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;
    private boolean active;
    private boolean valid;

    public CouponDTO() {}

    public CouponDTO(Coupon coupon) {
        this.id = coupon.getId();
        this.code = coupon.getCode();
        this.description = coupon.getDescription();
        this.discountType = coupon.getDiscountType().name();
        this.discountValue = coupon.getDiscountValue();
        this.minimumOrderValue = coupon.getMinimumOrderValue();
        this.maximumDiscount = coupon.getMaximumDiscount();
        this.usageLimit = coupon.getUsageLimit();
        this.usageLimitPerUser = coupon.getUsageLimitPerUser();
        this.timesUsed = coupon.getTimesUsed();
        this.validFrom = coupon.getValidFrom();
        this.validUntil = coupon.getValidUntil();
        this.active = coupon.isActive();
        this.valid = coupon.isValid();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public BigDecimal getMinimumOrderValue() {
        return minimumOrderValue;
    }

    public void setMinimumOrderValue(BigDecimal minimumOrderValue) {
        this.minimumOrderValue = minimumOrderValue;
    }

    public BigDecimal getMaximumDiscount() {
        return maximumDiscount;
    }

    public void setMaximumDiscount(BigDecimal maximumDiscount) {
        this.maximumDiscount = maximumDiscount;
    }

    public Integer getUsageLimit() {
        return usageLimit;
    }

    public void setUsageLimit(Integer usageLimit) {
        this.usageLimit = usageLimit;
    }

    public Integer getUsageLimitPerUser() {
        return usageLimitPerUser;
    }

    public void setUsageLimitPerUser(Integer usageLimitPerUser) {
        this.usageLimitPerUser = usageLimitPerUser;
    }

    public Integer getTimesUsed() {
        return timesUsed;
    }

    public void setTimesUsed(Integer timesUsed) {
        this.timesUsed = timesUsed;
    }

    public LocalDateTime getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(LocalDateTime validFrom) {
        this.validFrom = validFrom;
    }

    public LocalDateTime getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(LocalDateTime validUntil) {
        this.validUntil = validUntil;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }
}
