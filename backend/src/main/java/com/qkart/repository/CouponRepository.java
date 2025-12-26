package com.qkart.repository;

import com.qkart.model.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {

    Optional<Coupon> findByCodeIgnoreCase(String code);

    boolean existsByCodeIgnoreCase(String code);

    List<Coupon> findByActiveTrue();

    @Query("SELECT c FROM Coupon c WHERE c.active = true AND c.validFrom <= :now AND c.validUntil >= :now")
    List<Coupon> findValidCoupons(@Param("now") LocalDateTime now);

    @Query("SELECT c FROM Coupon c WHERE c.active = true AND c.validUntil < :now")
    List<Coupon> findExpiredCoupons(@Param("now") LocalDateTime now);
}
