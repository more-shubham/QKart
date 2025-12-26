package com.qkart.controller;

import com.qkart.dto.*;
import com.qkart.service.CouponService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
@CrossOrigin(origins = "*")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @GetMapping
    public ResponseEntity<List<CouponDTO>> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }

    @GetMapping("/active")
    public ResponseEntity<List<CouponDTO>> getActiveCoupons() {
        return ResponseEntity.ok(couponService.getActiveCoupons());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CouponDTO> getCouponById(@PathVariable Long id) {
        return ResponseEntity.ok(couponService.getCouponById(id));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<CouponDTO> getCouponByCode(@PathVariable String code) {
        return ResponseEntity.ok(couponService.getCouponByCode(code));
    }

    @PostMapping
    public ResponseEntity<CouponDTO> createCoupon(@Valid @RequestBody CreateCouponRequest request) {
        return ResponseEntity.ok(couponService.createCoupon(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CouponDTO> updateCoupon(
            @PathVariable Long id,
            @Valid @RequestBody CreateCouponRequest request) {
        return ResponseEntity.ok(couponService.updateCoupon(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateCoupon(@PathVariable Long id) {
        couponService.deactivateCoupon(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/validate")
    public ResponseEntity<CouponValidationResponse> validateCoupon(
            @Valid @RequestBody ApplyCouponRequest request) {
        return ResponseEntity.ok(couponService.validateCoupon(request));
    }

    @PostMapping("/apply")
    public ResponseEntity<CouponValidationResponse> applyCoupon(
            @Valid @RequestBody ApplyCouponRequest request) {
        CouponValidationResponse validation = couponService.validateCoupon(request);
        if (validation.isValid()) {
            // Coupon usage will be recorded when order is placed
            // This endpoint is mainly for validation + discount calculation
        }
        return ResponseEntity.ok(validation);
    }
}
