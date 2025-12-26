package com.qkart.service;

import com.qkart.dto.auth.AuthResponse;
import com.qkart.dto.auth.LoginRequest;
import com.qkart.dto.auth.RefreshTokenRequest;
import com.qkart.dto.auth.RegisterRequest;
import com.qkart.exception.BadRequestException;
import com.qkart.exception.ResourceNotFoundException;
import com.qkart.exception.UnauthorizedException;
import com.qkart.model.Cart;
import com.qkart.model.RefreshToken;
import com.qkart.model.User;
import com.qkart.repository.CartRepository;
import com.qkart.repository.RefreshTokenRepository;
import com.qkart.repository.UserRepository;
import com.qkart.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final long LOCK_TIME_DURATION = 15 * 60 * 1000; // 15 minutes

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        // Create new user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.CUSTOMER)
                .emailVerified(false)
                .build();

        user = userRepository.save(user);

        // Create cart for the user
        Cart cart = new Cart();
        cart.setUser(user);
        cartRepository.save(cart);

        // Generate tokens
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = createRefreshToken(user);

        log.info("New user registered: {}", user.getEmail());

        return buildAuthResponse(user, accessToken, refreshToken);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        // Check if account is locked
        if (user.isAccountLocked()) {
            if (isLockTimeExpired(user)) {
                unlockAccount(user);
            } else {
                throw new LockedException("Account is locked. Please try again later.");
            }
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().toLowerCase(),
                            request.getPassword()
                    )
            );

            // Reset failed attempts on successful login
            if (user.getFailedLoginAttempts() > 0) {
                user.setFailedLoginAttempts(0);
                userRepository.save(user);
            }

        } catch (BadCredentialsException e) {
            handleFailedLogin(user);
            throw new BadCredentialsException("Invalid email or password");
        }

        // Generate tokens
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = createRefreshToken(user);

        log.info("User logged in: {}", user.getEmail());

        return buildAuthResponse(user, accessToken, refreshToken);
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (refreshToken.isExpired()) {
            refreshTokenRepository.delete(refreshToken);
            throw new UnauthorizedException("Refresh token has expired. Please login again.");
        }

        User user = refreshToken.getUser();

        // Generate new access token
        String newAccessToken = jwtService.generateAccessToken(user);

        // Optionally rotate refresh token
        refreshTokenRepository.delete(refreshToken);
        String newRefreshToken = createRefreshToken(user);

        return buildAuthResponse(user, newAccessToken, newRefreshToken);
    }

    @Transactional
    public void logout(String refreshToken) {
        refreshTokenRepository.findByToken(refreshToken)
                .ifPresent(refreshTokenRepository::delete);
    }

    @Transactional
    public void logoutAll(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        refreshTokenRepository.deleteByUser(user);
    }

    private String createRefreshToken(User user) {
        // Delete existing refresh tokens for this user (optional: allow multiple sessions)
        // refreshTokenRepository.deleteByUser(user);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshTokenExpiration))
                .build();

        refreshTokenRepository.save(refreshToken);
        return refreshToken.getToken();
    }

    private void handleFailedLogin(User user) {
        int newFailedAttempts = user.getFailedLoginAttempts() + 1;
        user.setFailedLoginAttempts(newFailedAttempts);

        if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
            user.setAccountLocked(true);
            user.setLockTime(LocalDateTime.now());
            log.warn("Account locked for user: {} after {} failed attempts", user.getEmail(), newFailedAttempts);
        }

        userRepository.save(user);
    }

    private boolean isLockTimeExpired(User user) {
        if (user.getLockTime() == null) {
            return true;
        }
        LocalDateTime unlockTime = user.getLockTime().plusNanos(LOCK_TIME_DURATION * 1_000_000);
        return LocalDateTime.now().isAfter(unlockTime);
    }

    private void unlockAccount(User user) {
        user.setAccountLocked(false);
        user.setFailedLoginAttempts(0);
        user.setLockTime(null);
        userRepository.save(user);
    }

    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken) {
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(900L) // 15 minutes in seconds
                .user(AuthResponse.UserInfo.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .name(user.getName())
                        .role(user.getRole().name())
                        .build())
                .build();
    }
}
