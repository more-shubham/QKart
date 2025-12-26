package com.qkart.service;

import com.qkart.dto.ProductDTO;
import com.qkart.dto.RecommendationDTO;
import com.qkart.model.Order;
import com.qkart.model.OrderItem;
import com.qkart.model.Product;
import com.qkart.repository.OrderRepository;
import com.qkart.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    private static final int MAX_RECOMMENDATIONS = 8;

    public List<RecommendationDTO> getPersonalizedRecommendations(Long userId) {
        List<RecommendationDTO> recommendations = new ArrayList<>();

        // Get user's order history
        List<Order> userOrders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);

        if (!userOrders.isEmpty()) {
            // Based on purchase history
            RecommendationDTO basedOnHistory = getBasedOnPurchaseHistory(userOrders);
            if (!basedOnHistory.getProducts().isEmpty()) {
                recommendations.add(basedOnHistory);
            }

            // Frequently bought together
            RecommendationDTO frequentlyBought = getFrequentlyBoughtTogether(userOrders);
            if (!frequentlyBought.getProducts().isEmpty()) {
                recommendations.add(frequentlyBought);
            }
        }

        // Popular products
        recommendations.add(getPopularProducts());

        // New arrivals
        recommendations.add(getNewArrivals());

        return recommendations;
    }

    public List<RecommendationDTO> getProductRecommendations(Long productId) {
        List<RecommendationDTO> recommendations = new ArrayList<>();

        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return recommendations;
        }

        // Similar products in category
        RecommendationDTO similar = getSimilarProducts(product);
        if (!similar.getProducts().isEmpty()) {
            recommendations.add(similar);
        }

        // Products in same price range
        RecommendationDTO priceRange = getInPriceRange(product);
        if (!priceRange.getProducts().isEmpty()) {
            recommendations.add(priceRange);
        }

        return recommendations;
    }

    public RecommendationDTO getGuestRecommendations() {
        return getPopularProducts();
    }

    private RecommendationDTO getBasedOnPurchaseHistory(List<Order> orders) {
        // Get categories from purchased products
        Set<Long> purchasedProductIds = new HashSet<>();
        Map<String, Integer> categoryCount = new HashMap<>();

        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {
                purchasedProductIds.add(item.getProduct().getId());
                String category = item.getProduct().getCategory();
                categoryCount.merge(category, 1, Integer::sum);
            }
        }

        // Find most purchased category
        String topCategory = categoryCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);

        List<ProductDTO> products = new ArrayList<>();
        if (topCategory != null) {
            products = productRepository.findByCategory(topCategory).stream()
                    .filter(p -> !purchasedProductIds.contains(p.getId()))
                    .limit(MAX_RECOMMENDATIONS)
                    .map(this::toDTO)
                    .collect(Collectors.toList());
        }

        return RecommendationDTO.builder()
                .type("BASED_ON_HISTORY")
                .title("Recommended for You")
                .description("Based on your purchase history")
                .products(products)
                .build();
    }

    private RecommendationDTO getFrequentlyBoughtTogether(List<Order> userOrders) {
        // Get products the user has purchased
        Set<Long> userProductIds = userOrders.stream()
                .flatMap(o -> o.getItems().stream())
                .map(item -> item.getProduct().getId())
                .collect(Collectors.toSet());

        // Find orders from other users that contain same products
        List<Order> allOrders = orderRepository.findAll();
        Map<Long, Integer> productFrequency = new HashMap<>();

        for (Order order : allOrders) {
            boolean hasOverlap = order.getItems().stream()
                    .anyMatch(item -> userProductIds.contains(item.getProduct().getId()));

            if (hasOverlap) {
                for (OrderItem item : order.getItems()) {
                    if (!userProductIds.contains(item.getProduct().getId())) {
                        productFrequency.merge(item.getProduct().getId(), 1, Integer::sum);
                    }
                }
            }
        }

        // Get top recommended products
        List<ProductDTO> products = productFrequency.entrySet().stream()
                .sorted(Map.Entry.<Long, Integer>comparingByValue().reversed())
                .limit(MAX_RECOMMENDATIONS)
                .map(entry -> productRepository.findById(entry.getKey()).orElse(null))
                .filter(Objects::nonNull)
                .map(this::toDTO)
                .collect(Collectors.toList());

        return RecommendationDTO.builder()
                .type("FREQUENTLY_BOUGHT")
                .title("Customers Also Bought")
                .description("Popular with people who bought similar items")
                .products(products)
                .build();
    }

    private RecommendationDTO getSimilarProducts(Product product) {
        List<ProductDTO> products = productRepository.findByCategory(product.getCategory()).stream()
                .filter(p -> !p.getId().equals(product.getId()))
                .limit(MAX_RECOMMENDATIONS)
                .map(this::toDTO)
                .collect(Collectors.toList());

        return RecommendationDTO.builder()
                .type("SIMILAR")
                .title("Similar Products")
                .description("More " + product.getCategory() + " products you might like")
                .products(products)
                .build();
    }

    private RecommendationDTO getInPriceRange(Product product) {
        BigDecimal minPrice = product.getPrice().multiply(BigDecimal.valueOf(0.7));
        BigDecimal maxPrice = product.getPrice().multiply(BigDecimal.valueOf(1.3));

        List<ProductDTO> products = productRepository.findAll().stream()
                .filter(p -> !p.getId().equals(product.getId()))
                .filter(p -> p.getPrice().compareTo(minPrice) >= 0 && p.getPrice().compareTo(maxPrice) <= 0)
                .limit(MAX_RECOMMENDATIONS)
                .map(this::toDTO)
                .collect(Collectors.toList());

        return RecommendationDTO.builder()
                .type("PRICE_RANGE")
                .title("Similar Price Range")
                .description("Products in a similar price range")
                .products(products)
                .build();
    }

    private RecommendationDTO getPopularProducts() {
        // Get products that appear most in orders
        List<Order> allOrders = orderRepository.findAll();
        Map<Long, Integer> productCount = new HashMap<>();

        for (Order order : allOrders) {
            for (OrderItem item : order.getItems()) {
                productCount.merge(item.getProduct().getId(), item.getQuantity(), Integer::sum);
            }
        }

        List<ProductDTO> products;
        if (productCount.isEmpty()) {
            // Fallback to random products if no orders
            products = productRepository.findAll().stream()
                    .limit(MAX_RECOMMENDATIONS)
                    .map(this::toDTO)
                    .collect(Collectors.toList());
        } else {
            products = productCount.entrySet().stream()
                    .sorted(Map.Entry.<Long, Integer>comparingByValue().reversed())
                    .limit(MAX_RECOMMENDATIONS)
                    .map(entry -> productRepository.findById(entry.getKey()).orElse(null))
                    .filter(Objects::nonNull)
                    .map(this::toDTO)
                    .collect(Collectors.toList());
        }

        return RecommendationDTO.builder()
                .type("POPULAR")
                .title("Best Sellers")
                .description("Top products loved by our customers")
                .products(products)
                .build();
    }

    private RecommendationDTO getNewArrivals() {
        List<ProductDTO> products = productRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, MAX_RECOMMENDATIONS))
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        return RecommendationDTO.builder()
                .type("NEW_ARRIVALS")
                .title("New Arrivals")
                .description("Check out our latest products")
                .products(products)
                .build();
    }

    private ProductDTO toDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .category(product.getCategory())
                .imageUrl(product.getImageUrl())
                .stock(product.getStock())
                .rating(product.getRating())
                .build();
    }
}
