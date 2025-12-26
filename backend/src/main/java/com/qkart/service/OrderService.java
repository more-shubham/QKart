package com.qkart.service;

import com.qkart.dto.*;
import com.qkart.model.*;
import com.qkart.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final CartService cartService;
    private final CouponService couponService;
    private final LoyaltyService loyaltyService;

    @Transactional
    public OrderDTO checkout(CheckoutRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUserIdWithItems(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Address shippingAddress = addressRepository.findById(request.getShippingAddressId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        Order order = Order.builder()
                .user(user)
                .shippingAddress(shippingAddress)
                .status(Order.OrderStatus.CONFIRMED)
                .items(new ArrayList<>())
                .build();

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            subtotal = subtotal.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .priceAtPurchase(product.getPrice())
                    .build();
            orderItems.add(orderItem);
        }

        order.setItems(orderItems);
        order.setSubtotal(subtotal);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setConfirmedAt(LocalDateTime.now());
        // Set estimated delivery to 5-7 days from now
        order.setEstimatedDeliveryDate(LocalDateTime.now().plusDays(5));

        // Apply coupon if provided
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            ApplyCouponRequest couponRequest = new ApplyCouponRequest();
            couponRequest.setCode(request.getCouponCode());
            couponRequest.setUserId(request.getUserId());
            couponRequest.setOrderAmount(subtotal);

            CouponValidationResponse couponValidation = couponService.validateCoupon(couponRequest);
            if (couponValidation.isValid()) {
                discountAmount = couponValidation.getDiscountAmount();
                order.setCouponCode(request.getCouponCode().toUpperCase());
                order.setDiscountAmount(discountAmount);
            } else {
                throw new RuntimeException(couponValidation.getMessage());
            }
        }

        BigDecimal totalAmount = subtotal.subtract(discountAmount);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        // Record coupon usage after order is saved
        if (order.getCouponCode() != null) {
            couponService.recordCouponUsage(order.getCouponCode(), request.getUserId(), savedOrder.getId());
        }

        // Award loyalty points based on order total
        loyaltyService.earnPoints(request.getUserId(), totalAmount.doubleValue(), savedOrder.getId());

        cartService.clearCart(request.getUserId());

        return toDTO(savedOrder);
    }

    public List<OrderDTO> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, String status, String trackingNumber, String carrier) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Order.OrderStatus newStatus = Order.OrderStatus.valueOf(status);
        order.setStatus(newStatus);

        // Set tracking info if provided
        if (trackingNumber != null) {
            order.setTrackingNumber(trackingNumber);
        }
        if (carrier != null) {
            order.setShippingCarrier(carrier);
        }

        // Set timestamp based on status
        LocalDateTime now = LocalDateTime.now();
        switch (newStatus) {
            case CONFIRMED -> order.setConfirmedAt(now);
            case SHIPPED -> order.setShippedAt(now);
            case DELIVERED -> order.setDeliveredAt(now);
            case CANCELLED -> order.setCancelledAt(now);
            default -> {}
        }

        Order savedOrder = orderRepository.save(order);
        return toDTO(savedOrder);
    }

    private OrderDTO toDTO(Order order) {
        List<OrderItemDTO> items = order.getItems().stream()
                .map(this::toItemDTO)
                .collect(Collectors.toList());

        AddressDTO addressDTO = null;
        if (order.getShippingAddress() != null) {
            Address addr = order.getShippingAddress();
            addressDTO = AddressDTO.builder()
                    .id(addr.getId())
                    .street(addr.getStreet())
                    .city(addr.getCity())
                    .state(addr.getState())
                    .zipCode(addr.getZipCode())
                    .country(addr.getCountry())
                    .isDefault(addr.getIsDefault())
                    .build();
        }

        return OrderDTO.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .items(items)
                .shippingAddress(addressDTO)
                .subtotal(order.getSubtotal())
                .couponCode(order.getCouponCode())
                .discountAmount(order.getDiscountAmount())
                .totalAmount(order.getTotalAmount())
                .paymentMethod(order.getPaymentMethod())
                .status(order.getStatus().name())
                .trackingNumber(order.getTrackingNumber())
                .shippingCarrier(order.getShippingCarrier())
                .estimatedDeliveryDate(order.getEstimatedDeliveryDate())
                .createdAt(order.getCreatedAt())
                .confirmedAt(order.getConfirmedAt())
                .shippedAt(order.getShippedAt())
                .deliveredAt(order.getDeliveredAt())
                .cancelledAt(order.getCancelledAt())
                .build();
    }

    private OrderItemDTO toItemDTO(OrderItem item) {
        Product product = item.getProduct();
        return OrderItemDTO.builder()
                .id(item.getId())
                .productId(product.getId())
                .productName(product.getName())
                .productImage(product.getImageUrl())
                .quantity(item.getQuantity())
                .priceAtPurchase(item.getPriceAtPurchase())
                .build();
    }
}
