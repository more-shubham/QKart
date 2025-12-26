package com.qkart.controller;

import com.qkart.dto.LoyaltyAccountDTO;
import com.qkart.dto.PointsTransactionDTO;
import com.qkart.service.LoyaltyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/loyalty")
@RequiredArgsConstructor
public class LoyaltyController {

    private final LoyaltyService loyaltyService;
    private final com.qkart.repository.UserRepository userRepository;

    @GetMapping("/account")
    public ResponseEntity<LoyaltyAccountDTO> getAccount(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(loyaltyService.getAccountDTO(userId));
    }

    @GetMapping("/transactions")
    public ResponseEntity<Page<PointsTransactionDTO>> getTransactions(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long userId = getUserId(userDetails);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(loyaltyService.getTransactionHistory(userId, pageable));
    }

    @PostMapping("/birthday")
    public ResponseEntity<LoyaltyAccountDTO> setBirthday(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> request) {
        Long userId = getUserId(userDetails);
        LocalDate birthday = LocalDate.parse(request.get("birthday"));
        return ResponseEntity.ok(loyaltyService.setBirthday(userId, birthday));
    }

    @PostMapping("/birthday-bonus")
    public ResponseEntity<PointsTransactionDTO> claimBirthdayBonus(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(loyaltyService.claimBirthdayBonus(userId));
    }

    @PostMapping("/redeem")
    public ResponseEntity<PointsTransactionDTO> redeemPoints(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> request) {
        Long userId = getUserId(userDetails);
        Integer points = (Integer) request.get("points");
        Long orderId = request.get("orderId") != null ?
                Long.valueOf(request.get("orderId").toString()) : null;
        return ResponseEntity.ok(loyaltyService.redeemPoints(userId, points, orderId));
    }

    @GetMapping("/calculate-discount")
    public ResponseEntity<Map<String, Object>> calculateDiscount(@RequestParam Integer points) {
        Double discount = loyaltyService.calculateDiscount(points);
        return ResponseEntity.ok(Map.of(
                "points", points,
                "discount", discount
        ));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}
