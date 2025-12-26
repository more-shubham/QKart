package com.qkart.repository;

import com.qkart.model.CouponUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CouponUsageRepository extends JpaRepository<CouponUsage, Long> {

    @Query("SELECT COUNT(cu) FROM CouponUsage cu WHERE cu.coupon.id = :couponId AND cu.user.id = :userId")
    long countByCouponIdAndUserId(@Param("couponId") Long couponId, @Param("userId") Long userId);

    List<CouponUsage> findByUserId(Long userId);

    List<CouponUsage> findByCouponId(Long couponId);

    boolean existsByCouponIdAndOrderId(Long couponId, Long orderId);
}
