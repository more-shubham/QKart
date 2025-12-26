package com.qkart.service;

import com.qkart.config.StripeConfig;
import com.qkart.dto.CreatePaymentRequest;
import com.qkart.dto.PaymentResponse;
import com.qkart.exception.BadRequestException;
import com.qkart.exception.ResourceNotFoundException;
import com.qkart.model.Order;
import com.qkart.model.Payment;
import com.qkart.model.User;
import com.qkart.repository.OrderRepository;
import com.qkart.repository.PaymentRepository;
import com.qkart.repository.UserRepository;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final StripeConfig stripeConfig;

    @Transactional
    public PaymentResponse createPaymentIntent(CreatePaymentRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String currency = request.getCurrency() != null ? request.getCurrency() : "usd";

        try {
            // Create Stripe PaymentIntent
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(request.getAmount().multiply(BigDecimal.valueOf(100)).longValue()) // Convert to cents
                    .setCurrency(currency)
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build()
                    )
                    .putMetadata("userId", user.getId().toString())
                    .build();

            if (request.getOrderId() != null) {
                params = PaymentIntentCreateParams.builder()
                        .setAmount(request.getAmount().multiply(BigDecimal.valueOf(100)).longValue())
                        .setCurrency(currency)
                        .setAutomaticPaymentMethods(
                                PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                        .setEnabled(true)
                                        .build()
                        )
                        .putMetadata("userId", user.getId().toString())
                        .putMetadata("orderId", request.getOrderId().toString())
                        .build();
            }

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            // Save payment record
            Payment payment = Payment.builder()
                    .stripePaymentIntentId(paymentIntent.getId())
                    .stripeClientSecret(paymentIntent.getClientSecret())
                    .user(user)
                    .amount(request.getAmount())
                    .currency(currency.toUpperCase())
                    .status(Payment.PaymentStatus.PENDING)
                    .build();

            if (request.getOrderId() != null) {
                Order order = orderRepository.findById(request.getOrderId())
                        .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
                payment.setOrder(order);
            }

            Payment saved = paymentRepository.save(payment);

            return PaymentResponse.builder()
                    .id(saved.getId())
                    .clientSecret(paymentIntent.getClientSecret())
                    .paymentIntentId(paymentIntent.getId())
                    .amount(request.getAmount())
                    .currency(currency.toUpperCase())
                    .status(saved.getStatus().name())
                    .build();

        } catch (StripeException e) {
            log.error("Stripe error creating payment intent: {}", e.getMessage());
            throw new BadRequestException("Failed to create payment: " + e.getMessage());
        }
    }

    @Transactional
    public void handleWebhook(String payload, String signature) {
        Event event;

        try {
            event = Webhook.constructEvent(payload, signature, stripeConfig.getWebhookSecret());
        } catch (SignatureVerificationException e) {
            log.error("Webhook signature verification failed: {}", e.getMessage());
            throw new BadRequestException("Invalid webhook signature");
        }

        log.info("Received Stripe webhook event: {}", event.getType());

        switch (event.getType()) {
            case "payment_intent.succeeded" -> handlePaymentSuccess(event);
            case "payment_intent.payment_failed" -> handlePaymentFailure(event);
            case "payment_intent.canceled" -> handlePaymentCanceled(event);
            default -> log.info("Unhandled event type: {}", event.getType());
        }
    }

    private void handlePaymentSuccess(Event event) {
        PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer()
                .getObject().orElse(null);

        if (paymentIntent == null) {
            log.error("Failed to deserialize PaymentIntent from event");
            return;
        }

        paymentRepository.findByStripePaymentIntentId(paymentIntent.getId())
                .ifPresent(payment -> {
                    payment.setStatus(Payment.PaymentStatus.SUCCEEDED);
                    payment.setPaymentMethod(paymentIntent.getPaymentMethod());

                    // Update order status if linked
                    if (payment.getOrder() != null) {
                        payment.getOrder().setStatus(Order.OrderStatus.CONFIRMED);
                        orderRepository.save(payment.getOrder());
                    }

                    paymentRepository.save(payment);
                    log.info("Payment {} succeeded", payment.getId());
                });
    }

    private void handlePaymentFailure(Event event) {
        PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer()
                .getObject().orElse(null);

        if (paymentIntent == null) {
            log.error("Failed to deserialize PaymentIntent from event");
            return;
        }

        paymentRepository.findByStripePaymentIntentId(paymentIntent.getId())
                .ifPresent(payment -> {
                    payment.setStatus(Payment.PaymentStatus.FAILED);
                    if (paymentIntent.getLastPaymentError() != null) {
                        payment.setFailureMessage(paymentIntent.getLastPaymentError().getMessage());
                    }
                    paymentRepository.save(payment);
                    log.info("Payment {} failed", payment.getId());
                });
    }

    private void handlePaymentCanceled(Event event) {
        PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer()
                .getObject().orElse(null);

        if (paymentIntent == null) {
            log.error("Failed to deserialize PaymentIntent from event");
            return;
        }

        paymentRepository.findByStripePaymentIntentId(paymentIntent.getId())
                .ifPresent(payment -> {
                    payment.setStatus(Payment.PaymentStatus.CANCELLED);
                    paymentRepository.save(payment);
                    log.info("Payment {} canceled", payment.getId());
                });
    }

    public Payment getPaymentByIntentId(String paymentIntentId) {
        return paymentRepository.findByStripePaymentIntentId(paymentIntentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
    }

    public PaymentResponse getPaymentStatus(String paymentIntentId) {
        Payment payment = getPaymentByIntentId(paymentIntentId);

        return PaymentResponse.builder()
                .id(payment.getId())
                .paymentIntentId(payment.getStripePaymentIntentId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus().name())
                .build();
    }
}
