package com.qkart.controller;

import com.qkart.dto.AddressDTO;
import com.qkart.model.User;
import com.qkart.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String name = body.get("name");
        return ResponseEntity.ok(userService.createUser(email, name));
    }

    @GetMapping("/{userId}/addresses")
    public ResponseEntity<List<AddressDTO>> getUserAddresses(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserAddresses(userId));
    }

    @PostMapping("/{userId}/addresses")
    public ResponseEntity<AddressDTO> addAddress(
            @PathVariable Long userId,
            @Valid @RequestBody AddressDTO addressDTO) {
        return ResponseEntity.ok(userService.addAddress(userId, addressDTO));
    }

    @DeleteMapping("/{userId}/addresses/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable Long userId,
            @PathVariable Long addressId) {
        userService.deleteAddress(userId, addressId);
        return ResponseEntity.noContent().build();
    }
}
