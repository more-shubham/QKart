package com.qkart.dto;

import com.qkart.model.LoyaltyAccount;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyAccountDTO {
    private Long id;
    private Long userId;
    private Integer pointsBalance;
    private Integer lifetimePoints;
    private String tier;
    private String tierDisplayName;
    private Double pointsMultiplier;
    private Integer pointsToNextTier;
    private String nextTier;
    private LocalDate birthday;
    private boolean birthdayBonusAvailable;

    public static LoyaltyAccountDTO fromEntity(LoyaltyAccount account) {
        LoyaltyAccount.LoyaltyTier currentTier = account.getTier();
        LoyaltyAccount.LoyaltyTier nextTier = getNextTier(currentTier);

        int pointsToNext = 0;
        String nextTierName = null;
        if (nextTier != null) {
            pointsToNext = nextTier.getRequiredPoints() - account.getLifetimePoints();
            nextTierName = nextTier.getDisplayName();
        }

        boolean birthdayBonusAvailable = false;
        if (account.getBirthday() != null) {
            LocalDate today = LocalDate.now();
            boolean isBirthday = account.getBirthday().getMonth() == today.getMonth()
                && account.getBirthday().getDayOfMonth() == today.getDayOfMonth();
            birthdayBonusAvailable = isBirthday &&
                (account.getBirthdayBonusYear() == null || account.getBirthdayBonusYear() != today.getYear());
        }

        return LoyaltyAccountDTO.builder()
                .id(account.getId())
                .userId(account.getUser().getId())
                .pointsBalance(account.getPointsBalance())
                .lifetimePoints(account.getLifetimePoints())
                .tier(currentTier.name())
                .tierDisplayName(currentTier.getDisplayName())
                .pointsMultiplier(currentTier.getMultiplier())
                .pointsToNextTier(pointsToNext > 0 ? pointsToNext : 0)
                .nextTier(nextTierName)
                .birthday(account.getBirthday())
                .birthdayBonusAvailable(birthdayBonusAvailable)
                .build();
    }

    private static LoyaltyAccount.LoyaltyTier getNextTier(LoyaltyAccount.LoyaltyTier current) {
        return switch (current) {
            case BRONZE -> LoyaltyAccount.LoyaltyTier.SILVER;
            case SILVER -> LoyaltyAccount.LoyaltyTier.GOLD;
            case GOLD -> LoyaltyAccount.LoyaltyTier.PLATINUM;
            case PLATINUM -> null;
        };
    }
}
