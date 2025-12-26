package com.qkart.service;

import com.qkart.dto.*;
import com.qkart.model.*;
import com.qkart.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
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

        BigDecimal totalAmount = BigDecimal.ZERO;
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
            totalAmount = totalAmount.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .priceAtPurchase(product.getPrice())
                    .build();
            orderItems.add(orderItem);
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

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
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .createdAt(order.getCreatedAt())
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
