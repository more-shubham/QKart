package com.qkart.service;

import com.qkart.dto.WishlistItemDTO;
import com.qkart.exception.BadRequestException;
import com.qkart.exception.ResourceNotFoundException;
import com.qkart.model.Product;
import com.qkart.model.User;
import com.qkart.model.WishlistItem;
import com.qkart.repository.ProductRepository;
import com.qkart.repository.UserRepository;
import com.qkart.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public List<WishlistItemDTO> getWishlist(Long userId) {
        return wishlistRepository.findByUserIdOrderByAddedAtDesc(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public WishlistItemDTO addToWishlist(Long userId, Long productId) {
        // Check if already in wishlist
        if (wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new BadRequestException("Product is already in wishlist");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        WishlistItem item = WishlistItem.builder()
                .user(user)
                .product(product)
                .build();

        WishlistItem saved = wishlistRepository.save(item);
        return toDTO(saved);
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        if (!wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new ResourceNotFoundException("Product not found in wishlist");
        }
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }

    public boolean isInWishlist(Long userId, Long productId) {
        return wishlistRepository.existsByUserIdAndProductId(userId, productId);
    }

    @Transactional
    public void clearWishlist(Long userId) {
        wishlistRepository.deleteAllByUserId(userId);
    }

    public long getWishlistCount(Long userId) {
        return wishlistRepository.countByUserId(userId);
    }

    private WishlistItemDTO toDTO(WishlistItem item) {
        Product product = item.getProduct();
        return WishlistItemDTO.builder()
                .id(item.getId())
                .productId(product.getId())
                .productName(product.getName())
                .productImage(product.getImageUrl())
                .price(product.getPrice().doubleValue())
                .stock(product.getStock())
                .rating(product.getRating())
                .addedAt(item.getAddedAt())
                .build();
    }
}
