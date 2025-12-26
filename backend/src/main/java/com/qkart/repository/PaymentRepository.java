package com.qkart.repository;

import com.qkart.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByStripePaymentIntentId(String paymentIntentId);

    Optional<Payment> findByOrderId(Long orderId);

    List<Payment> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Payment> findByStatus(Payment.PaymentStatus status);
}
