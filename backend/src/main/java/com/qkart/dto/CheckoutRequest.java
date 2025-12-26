package com.qkart.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequest {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Shipping address ID is required")
    private Long shippingAddressId;

    private String paymentMethod;

    private String couponCode;
}
