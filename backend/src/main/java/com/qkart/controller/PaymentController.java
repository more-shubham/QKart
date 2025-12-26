package com.qkart.controller;

import com.qkart.dto.CreatePaymentRequest;
import com.qkart.dto.PaymentResponse;
import com.qkart.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<PaymentResponse> createPaymentIntent(
            @Valid @RequestBody CreatePaymentRequest request) {
        return ResponseEntity.ok(paymentService.createPaymentIntent(request));
    }

    @GetMapping("/status/{paymentIntentId}")
    public ResponseEntity<PaymentResponse> getPaymentStatus(
            @PathVariable String paymentIntentId) {
        return ResponseEntity.ok(paymentService.getPaymentStatus(paymentIntentId));
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String signature) {
        paymentService.handleWebhook(payload, signature);
        return ResponseEntity.ok("Webhook received");
    }
}
