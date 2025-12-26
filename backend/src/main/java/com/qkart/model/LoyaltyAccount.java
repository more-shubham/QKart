package com.qkart.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "loyalty_accounts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private Integer pointsBalance = 0;

    @Column(nullable = false)
    private Integer lifetimePoints = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LoyaltyTier tier = LoyaltyTier.BRONZE;

    private LocalDate birthday;

    private boolean birthdayBonusClaimed = false;

    private Integer birthdayBonusYear;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (tier == null) {
            tier = LoyaltyTier.BRONZE;
        }
        if (pointsBalance == null) {
            pointsBalance = 0;
        }
        if (lifetimePoints == null) {
            lifetimePoints = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void addPoints(int points) {
        this.pointsBalance += points;
        this.lifetimePoints += points;
        updateTier();
    }

    public boolean redeemPoints(int points) {
        if (pointsBalance >= points) {
            this.pointsBalance -= points;
            return true;
        }
        return false;
    }

    private void updateTier() {
        if (lifetimePoints >= 10000) {
            this.tier = LoyaltyTier.PLATINUM;
        } else if (lifetimePoints >= 5000) {
            this.tier = LoyaltyTier.GOLD;
        } else if (lifetimePoints >= 1000) {
            this.tier = LoyaltyTier.SILVER;
        } else {
            this.tier = LoyaltyTier.BRONZE;
        }
    }

    public double getPointsMultiplier() {
        return tier.getMultiplier();
    }

    public enum LoyaltyTier {
        BRONZE(1.0, "Bronze", 0),
        SILVER(1.25, "Silver", 1000),
        GOLD(1.5, "Gold", 5000),
        PLATINUM(2.0, "Platinum", 10000);

        private final double multiplier;
        private final String displayName;
        private final int requiredPoints;

        LoyaltyTier(double multiplier, String displayName, int requiredPoints) {
            this.multiplier = multiplier;
            this.displayName = displayName;
            this.requiredPoints = requiredPoints;
        }

        public double getMultiplier() {
            return multiplier;
        }

        public String getDisplayName() {
            return displayName;
        }

        public int getRequiredPoints() {
            return requiredPoints;
        }
    }
}
