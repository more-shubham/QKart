package com.qkart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private Long userId;
    private List<OrderItemDTO> items;
    private AddressDTO shippingAddress;
    private BigDecimal subtotal;
    private String couponCode;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String status;

    // Tracking information
    private String trackingNumber;
    private String shippingCarrier;
    private LocalDateTime estimatedDeliveryDate;

    // Status timestamps
    private LocalDateTime createdAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime cancelledAt;
}
