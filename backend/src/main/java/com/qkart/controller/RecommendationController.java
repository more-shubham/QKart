package com.qkart.controller;

import com.qkart.dto.RecommendationDTO;
import com.qkart.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final com.qkart.repository.UserRepository userRepository;

    @GetMapping("/personalized")
    public ResponseEntity<List<RecommendationDTO>> getPersonalized(
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.ok(List.of(recommendationService.getGuestRecommendations()));
        }
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(recommendationService.getPersonalizedRecommendations(userId));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<RecommendationDTO>> getProductRecommendations(
            @PathVariable Long productId) {
        return ResponseEntity.ok(recommendationService.getProductRecommendations(productId));
    }

    @GetMapping("/guest")
    public ResponseEntity<RecommendationDTO> getGuestRecommendations() {
        return ResponseEntity.ok(recommendationService.getGuestRecommendations());
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}
