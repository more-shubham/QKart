package com.qkart.repository;

import com.qkart.model.PointsTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PointsTransactionRepository extends JpaRepository<PointsTransaction, Long> {

    Page<PointsTransaction> findByLoyaltyAccountIdOrderByCreatedAtDesc(Long loyaltyAccountId, Pageable pageable);

    List<PointsTransaction> findByLoyaltyAccountIdOrderByCreatedAtDesc(Long loyaltyAccountId);

    List<PointsTransaction> findByOrderId(Long orderId);
}
