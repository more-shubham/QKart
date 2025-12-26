package com.qkart.dto;

import com.qkart.model.PointsTransaction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointsTransactionDTO {
    private Long id;
    private Integer points;
    private String type;
    private String description;
    private Long orderId;
    private Double multiplierApplied;
    private Integer balanceAfter;
    private LocalDateTime createdAt;

    public static PointsTransactionDTO fromEntity(PointsTransaction transaction) {
        return PointsTransactionDTO.builder()
                .id(transaction.getId())
                .points(transaction.getPoints())
                .type(transaction.getType().name())
                .description(transaction.getDescription())
                .orderId(transaction.getOrderId())
                .multiplierApplied(transaction.getMultiplierApplied())
                .balanceAfter(transaction.getBalanceAfter())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
