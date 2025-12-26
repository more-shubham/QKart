package com.qkart.service;

import com.qkart.dto.LoyaltyAccountDTO;
import com.qkart.dto.PointsTransactionDTO;
import com.qkart.model.LoyaltyAccount;
import com.qkart.model.PointsTransaction;
import com.qkart.model.User;
import com.qkart.repository.LoyaltyAccountRepository;
import com.qkart.repository.PointsTransactionRepository;
import com.qkart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class LoyaltyService {

    private final LoyaltyAccountRepository loyaltyAccountRepository;
    private final PointsTransactionRepository pointsTransactionRepository;
    private final UserRepository userRepository;

    private static final int POINTS_PER_DOLLAR = 10;
    private static final int BIRTHDAY_BONUS_POINTS = 500;
    private static final double POINTS_TO_DOLLAR_RATIO = 100.0; // 100 points = $1

    @Transactional
    public LoyaltyAccount getOrCreateAccount(Long userId) {
        return loyaltyAccountRepository.findByUserId(userId)
                .orElseGet(() -> createAccount(userId));
    }

    private LoyaltyAccount createAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LoyaltyAccount account = LoyaltyAccount.builder()
                .user(user)
                .pointsBalance(0)
                .lifetimePoints(0)
                .tier(LoyaltyAccount.LoyaltyTier.BRONZE)
                .build();

        return loyaltyAccountRepository.save(account);
    }

    public LoyaltyAccountDTO getAccountDTO(Long userId) {
        LoyaltyAccount account = getOrCreateAccount(userId);
        return LoyaltyAccountDTO.fromEntity(account);
    }

    @Transactional
    public PointsTransactionDTO earnPoints(Long userId, Double orderTotal, Long orderId) {
        LoyaltyAccount account = getOrCreateAccount(userId);

        int basePoints = (int) (orderTotal * POINTS_PER_DOLLAR);
        double multiplier = account.getTier().getMultiplier();
        int earnedPoints = (int) (basePoints * multiplier);

        account.setPointsBalance(account.getPointsBalance() + earnedPoints);
        account.setLifetimePoints(account.getLifetimePoints() + earnedPoints);

        updateTier(account);
        loyaltyAccountRepository.save(account);

        PointsTransaction transaction = PointsTransaction.builder()
                .loyaltyAccount(account)
                .points(earnedPoints)
                .type(PointsTransaction.TransactionType.EARNED)
                .description("Points earned from order #" + orderId)
                .orderId(orderId)
                .multiplierApplied(multiplier)
                .balanceAfter(account.getPointsBalance())
                .build();

        pointsTransactionRepository.save(transaction);

        return PointsTransactionDTO.fromEntity(transaction);
    }

    @Transactional
    public PointsTransactionDTO redeemPoints(Long userId, Integer points, Long orderId) {
        LoyaltyAccount account = getOrCreateAccount(userId);

        if (account.getPointsBalance() < points) {
            throw new RuntimeException("Insufficient points balance");
        }

        if (points <= 0) {
            throw new RuntimeException("Points must be positive");
        }

        account.setPointsBalance(account.getPointsBalance() - points);
        loyaltyAccountRepository.save(account);

        PointsTransaction transaction = PointsTransaction.builder()
                .loyaltyAccount(account)
                .points(-points)
                .type(PointsTransaction.TransactionType.REDEEMED)
                .description("Points redeemed for order #" + orderId)
                .orderId(orderId)
                .balanceAfter(account.getPointsBalance())
                .build();

        pointsTransactionRepository.save(transaction);

        return PointsTransactionDTO.fromEntity(transaction);
    }

    @Transactional
    public PointsTransactionDTO claimBirthdayBonus(Long userId) {
        LoyaltyAccount account = getOrCreateAccount(userId);

        if (account.getBirthday() == null) {
            throw new RuntimeException("Birthday not set");
        }

        LocalDate today = LocalDate.now();
        boolean isBirthday = account.getBirthday().getMonth() == today.getMonth()
                && account.getBirthday().getDayOfMonth() == today.getDayOfMonth();

        if (!isBirthday) {
            throw new RuntimeException("Birthday bonus can only be claimed on your birthday");
        }

        if (account.getBirthdayBonusYear() != null && account.getBirthdayBonusYear() == today.getYear()) {
            throw new RuntimeException("Birthday bonus already claimed this year");
        }

        account.setPointsBalance(account.getPointsBalance() + BIRTHDAY_BONUS_POINTS);
        account.setLifetimePoints(account.getLifetimePoints() + BIRTHDAY_BONUS_POINTS);
        account.setBirthdayBonusYear(today.getYear());

        updateTier(account);
        loyaltyAccountRepository.save(account);

        PointsTransaction transaction = PointsTransaction.builder()
                .loyaltyAccount(account)
                .points(BIRTHDAY_BONUS_POINTS)
                .type(PointsTransaction.TransactionType.BONUS)
                .description("Birthday bonus for " + today.getYear())
                .balanceAfter(account.getPointsBalance())
                .build();

        pointsTransactionRepository.save(transaction);

        return PointsTransactionDTO.fromEntity(transaction);
    }

    @Transactional
    public LoyaltyAccountDTO setBirthday(Long userId, LocalDate birthday) {
        LoyaltyAccount account = getOrCreateAccount(userId);
        account.setBirthday(birthday);
        loyaltyAccountRepository.save(account);
        return LoyaltyAccountDTO.fromEntity(account);
    }

    public Page<PointsTransactionDTO> getTransactionHistory(Long userId, Pageable pageable) {
        LoyaltyAccount account = getOrCreateAccount(userId);
        return pointsTransactionRepository
                .findByLoyaltyAccountIdOrderByCreatedAtDesc(account.getId(), pageable)
                .map(PointsTransactionDTO::fromEntity);
    }

    public Double calculateDiscount(Integer points) {
        return points / POINTS_TO_DOLLAR_RATIO;
    }

    public Integer calculatePointsNeeded(Double discountAmount) {
        return (int) (discountAmount * POINTS_TO_DOLLAR_RATIO);
    }

    private void updateTier(LoyaltyAccount account) {
        int lifetimePoints = account.getLifetimePoints();

        if (lifetimePoints >= LoyaltyAccount.LoyaltyTier.PLATINUM.getRequiredPoints()) {
            account.setTier(LoyaltyAccount.LoyaltyTier.PLATINUM);
        } else if (lifetimePoints >= LoyaltyAccount.LoyaltyTier.GOLD.getRequiredPoints()) {
            account.setTier(LoyaltyAccount.LoyaltyTier.GOLD);
        } else if (lifetimePoints >= LoyaltyAccount.LoyaltyTier.SILVER.getRequiredPoints()) {
            account.setTier(LoyaltyAccount.LoyaltyTier.SILVER);
        } else {
            account.setTier(LoyaltyAccount.LoyaltyTier.BRONZE);
        }
    }
}
