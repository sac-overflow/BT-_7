package com.example.products.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Table(name = "transaction_types")
public class TransactionType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long txnTypeId;

    @Column(nullable = false)
    private Long productId;

    private Long balanceId;

    @Column(nullable = false)
    private String txnName;

    private String txnDescription;

    private Boolean isDebit;

    private Boolean isAllowed;

    private BigDecimal minAmount;

    private BigDecimal maxAmount;

    private BigDecimal dailyLimit;

    private Integer frequencyLimitPerDay;

    private Boolean requiresMinBalanceCheck;

    private Timestamp createdAt;

    private Timestamp updatedAt;

	public Long getTxnTypeId() {
		return txnTypeId;
	}

	public void setTxnTypeId(Long txnTypeId) {
		this.txnTypeId = txnTypeId;
	}

	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
	}

	public Long getBalanceId() {
		return balanceId;
	}

	public void setBalanceId(Long balanceId) {
		this.balanceId = balanceId;
	}

	public String getTxnName() {
		return txnName;
	}

	public void setTxnName(String txnName) {
		this.txnName = txnName;
	}

	public String getTxnDescription() {
		return txnDescription;
	}

	public void setTxnDescription(String txnDescription) {
		this.txnDescription = txnDescription;
	}

	public Boolean getIsDebit() {
		return isDebit;
	}

	public void setIsDebit(Boolean isDebit) {
		this.isDebit = isDebit;
	}

	public Boolean getIsAllowed() {
		return isAllowed;
	}

	public void setIsAllowed(Boolean isAllowed) {
		this.isAllowed = isAllowed;
	}

	public BigDecimal getMinAmount() {
		return minAmount;
	}

	public void setMinAmount(BigDecimal minAmount) {
		this.minAmount = minAmount;
	}

	public BigDecimal getMaxAmount() {
		return maxAmount;
	}

	public void setMaxAmount(BigDecimal maxAmount) {
		this.maxAmount = maxAmount;
	}

	public BigDecimal getDailyLimit() {
		return dailyLimit;
	}

	public void setDailyLimit(BigDecimal dailyLimit) {
		this.dailyLimit = dailyLimit;
	}

	public Integer getFrequencyLimitPerDay() {
		return frequencyLimitPerDay;
	}

	public void setFrequencyLimitPerDay(Integer frequencyLimitPerDay) {
		this.frequencyLimitPerDay = frequencyLimitPerDay;
	}

	public Boolean getRequiresMinBalanceCheck() {
		return requiresMinBalanceCheck;
	}

	public void setRequiresMinBalanceCheck(Boolean requiresMinBalanceCheck) {
		this.requiresMinBalanceCheck = requiresMinBalanceCheck;
	}

	public Timestamp getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}

	public Timestamp getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Timestamp updatedAt) {
		this.updatedAt = updatedAt;
	}
    
}
