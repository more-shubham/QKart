package com.qkart.controller;

import com.qkart.dto.WishlistItemDTO;
import com.qkart.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<WishlistItemDTO>> getWishlist(@PathVariable Long userId) {
        return ResponseEntity.ok(wishlistService.getWishlist(userId));
    }

    @PostMapping("/{userId}/add/{productId}")
    public ResponseEntity<WishlistItemDTO> addToWishlist(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        return ResponseEntity.ok(wishlistService.addToWishlist(userId, productId));
    }

    @DeleteMapping("/{userId}/remove/{productId}")
    public ResponseEntity<Void> removeFromWishlist(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        wishlistService.removeFromWishlist(userId, productId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}/check/{productId}")
    public ResponseEntity<Map<String, Boolean>> isInWishlist(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        boolean inWishlist = wishlistService.isInWishlist(userId, productId);
        return ResponseEntity.ok(Map.of("inWishlist", inWishlist));
    }

    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<Void> clearWishlist(@PathVariable Long userId) {
        wishlistService.clearWishlist(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}/count")
    public ResponseEntity<Map<String, Long>> getWishlistCount(@PathVariable Long userId) {
        long count = wishlistService.getWishlistCount(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }
}
