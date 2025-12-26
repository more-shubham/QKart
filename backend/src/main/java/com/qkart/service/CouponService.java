package com.qkart.service;

import com.qkart.dto.*;
import com.qkart.model.Coupon;
import com.qkart.model.CouponUsage;
import com.qkart.model.Order;
import com.qkart.model.User;
import com.qkart.repository.CouponRepository;
import com.qkart.repository.CouponUsageRepository;
import com.qkart.repository.OrderRepository;
import com.qkart.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CouponService {

    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public CouponService(CouponRepository couponRepository,
                        CouponUsageRepository couponUsageRepository,
                        UserRepository userRepository,
                        OrderRepository orderRepository) {
        this.couponRepository = couponRepository;
        this.couponUsageRepository = couponUsageRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    public List<CouponDTO> getAllCoupons() {
        return couponRepository.findAll().stream()
                .map(CouponDTO::new)
                .collect(Collectors.toList());
    }

    public List<CouponDTO> getActiveCoupons() {
        return couponRepository.findValidCoupons(LocalDateTime.now()).stream()
                .map(CouponDTO::new)
                .collect(Collectors.toList());
    }

    public CouponDTO getCouponById(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
        return new CouponDTO(coupon);
    }

    public CouponDTO getCouponByCode(String code) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
        return new CouponDTO(coupon);
    }

    @Transactional
    public CouponDTO createCoupon(CreateCouponRequest request) {
        if (couponRepository.existsByCodeIgnoreCase(request.getCode())) {
            throw new RuntimeException("Coupon code already exists");
        }

        Coupon coupon = new Coupon();
        coupon.setCode(request.getCode());
        coupon.setDescription(request.getDescription());
        coupon.setDiscountType(Coupon.DiscountType.valueOf(request.getDiscountType()));
        coupon.setDiscountValue(request.getDiscountValue());
        coupon.setMinimumOrderValue(request.getMinimumOrderValue());
        coupon.setMaximumDiscount(request.getMaximumDiscount());
        coupon.setUsageLimit(request.getUsageLimit());
        coupon.setUsageLimitPerUser(request.getUsageLimitPerUser());
        coupon.setValidFrom(request.getValidFrom());
        coupon.setValidUntil(request.getValidUntil());
        coupon.setActive(request.isActive());

        // Validate percentage doesn't exceed 100
        if (coupon.getDiscountType() == Coupon.DiscountType.PERCENTAGE &&
            coupon.getDiscountValue().compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new RuntimeException("Percentage discount cannot exceed 100%");
        }

        Coupon saved = couponRepository.save(coupon);
        return new CouponDTO(saved);
    }

    @Transactional
    public CouponDTO updateCoupon(Long id, CreateCouponRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));

        // Check if code is being changed and if new code already exists
        if (!coupon.getCode().equalsIgnoreCase(request.getCode()) &&
            couponRepository.existsByCodeIgnoreCase(request.getCode())) {
            throw new RuntimeException("Coupon code already exists");
        }

        coupon.setCode(request.getCode());
        coupon.setDescription(request.getDescription());
        coupon.setDiscountType(Coupon.DiscountType.valueOf(request.getDiscountType()));
        coupon.setDiscountValue(request.getDiscountValue());
        coupon.setMinimumOrderValue(request.getMinimumOrderValue());
        coupon.setMaximumDiscount(request.getMaximumDiscount());
        coupon.setUsageLimit(request.getUsageLimit());
        coupon.setUsageLimitPerUser(request.getUsageLimitPerUser());
        coupon.setValidFrom(request.getValidFrom());
        coupon.setValidUntil(request.getValidUntil());
        coupon.setActive(request.isActive());

        Coupon saved = couponRepository.save(coupon);
        return new CouponDTO(saved);
    }

    @Transactional
    public void deleteCoupon(Long id) {
        if (!couponRepository.existsById(id)) {
            throw new RuntimeException("Coupon not found");
        }
        couponRepository.deleteById(id);
    }

    @Transactional
    public void deactivateCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
        coupon.setActive(false);
        couponRepository.save(coupon);
    }

    public CouponValidationResponse validateCoupon(ApplyCouponRequest request) {
        // Find coupon
        Coupon coupon = couponRepository.findByCodeIgnoreCase(request.getCode())
                .orElse(null);

        if (coupon == null) {
            return CouponValidationResponse.invalid("Invalid coupon code");
        }

        // Check if coupon is active
        if (!coupon.isActive()) {
            return CouponValidationResponse.invalid("This coupon is no longer active");
        }

        // Check validity period
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(coupon.getValidFrom())) {
            return CouponValidationResponse.invalid("This coupon is not yet valid");
        }
        if (now.isAfter(coupon.getValidUntil())) {
            return CouponValidationResponse.invalid("This coupon has expired");
        }

        // Check total usage limit
        if (coupon.getUsageLimit() != null && coupon.getTimesUsed() >= coupon.getUsageLimit()) {
            return CouponValidationResponse.invalid("This coupon has reached its usage limit");
        }

        // Check per-user usage limit
        if (coupon.getUsageLimitPerUser() != null) {
            long userUsageCount = couponUsageRepository.countByCouponIdAndUserId(
                    coupon.getId(), request.getUserId());
            if (userUsageCount >= coupon.getUsageLimitPerUser()) {
                return CouponValidationResponse.invalid("You have already used this coupon the maximum number of times");
            }
        }

        // Check minimum order value
        if (coupon.getMinimumOrderValue() != null &&
            request.getOrderAmount().compareTo(coupon.getMinimumOrderValue()) < 0) {
            return CouponValidationResponse.invalid(
                    String.format("Minimum order value of $%.2f required for this coupon",
                            coupon.getMinimumOrderValue()));
        }

        // Calculate discount
        BigDecimal discountAmount = calculateDiscount(coupon, request.getOrderAmount());
        BigDecimal finalAmount = request.getOrderAmount().subtract(discountAmount);

        return CouponValidationResponse.valid(
                coupon.getCode(),
                coupon.getDiscountType().name(),
                coupon.getDiscountValue(),
                discountAmount,
                request.getOrderAmount(),
                finalAmount
        );
    }

    private BigDecimal calculateDiscount(Coupon coupon, BigDecimal orderAmount) {
        BigDecimal discount;

        if (coupon.getDiscountType() == Coupon.DiscountType.PERCENTAGE) {
            discount = orderAmount.multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else {
            discount = coupon.getDiscountValue();
        }

        // Apply maximum discount cap if set
        if (coupon.getMaximumDiscount() != null &&
            discount.compareTo(coupon.getMaximumDiscount()) > 0) {
            discount = coupon.getMaximumDiscount();
        }

        // Don't allow discount to exceed order amount
        if (discount.compareTo(orderAmount) > 0) {
            discount = orderAmount;
        }

        return discount.setScale(2, RoundingMode.HALF_UP);
    }

    @Transactional
    public void recordCouponUsage(String code, Long userId, Long orderId) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = null;
        if (orderId != null) {
            order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));
        }

        // Create usage record
        CouponUsage usage = new CouponUsage();
        usage.setCoupon(coupon);
        usage.setUser(user);
        usage.setOrder(order);
        couponUsageRepository.save(usage);

        // Increment usage count
        coupon.setTimesUsed(coupon.getTimesUsed() + 1);
        couponRepository.save(coupon);
    }
}
