package com.example.products.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "business_rules")
public class BusinessRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("ruleId")
    private Long ruleId;

    @Column(nullable = false)
    @JsonProperty("productId")
    private Long productId;

    @JsonProperty("minTerm")
    private Integer minTerm;

    @JsonProperty("maxTerm")
    private Integer maxTerm;

    @JsonProperty("minAmount")
    private BigDecimal minAmount;

    @JsonProperty("maxAmount")
    private BigDecimal maxAmount;

    @JsonProperty("interestRate")
    private BigDecimal interestRate;

    @JsonProperty("compoundingFrequency")
    private String compoundingFrequency;

    @JsonProperty("prematureWithdrawalAllowed")
    private Boolean prematureWithdrawalAllowed;

    @JsonProperty("prematurePenaltyRate")
    private BigDecimal prematurePenaltyRate;

    @JsonProperty("autoRenewal")
    private Boolean autoRenewal;

    @JsonProperty("minBalanceRequired")
    private BigDecimal minBalanceRequired;

    @JsonProperty("createdAt")
    private LocalDateTime createdAt;

    @JsonProperty("updatedAt")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

	public Long getRuleId() {
		return ruleId;
	}

	public void setRuleId(Long ruleId) {
		this.ruleId = ruleId;
	}

	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
	}

	public Integer getMinTerm() {
		return minTerm;
	}

	public void setMinTerm(Integer minTerm) {
		this.minTerm = minTerm;
	}

	public Integer getMaxTerm() {
		return maxTerm;
	}

	public void setMaxTerm(Integer maxTerm) {
		this.maxTerm = maxTerm;
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

	public BigDecimal getInterestRate() {
		return interestRate;
	}

	public void setInterestRate(BigDecimal interestRate) {
		this.interestRate = interestRate;
	}

	public String getCompoundingFrequency() {
		return compoundingFrequency;
	}

	public void setCompoundingFrequency(String compoundingFrequency) {
		this.compoundingFrequency = compoundingFrequency;
	}

	public Boolean getPrematureWithdrawalAllowed() {
		return prematureWithdrawalAllowed;
	}

	public void setPrematureWithdrawalAllowed(Boolean prematureWithdrawalAllowed) {
		this.prematureWithdrawalAllowed = prematureWithdrawalAllowed;
	}

	public BigDecimal getPrematurePenaltyRate() {
		return prematurePenaltyRate;
	}

	public void setPrematurePenaltyRate(BigDecimal prematurePenaltyRate) {
		this.prematurePenaltyRate = prematurePenaltyRate;
	}

	public Boolean getAutoRenewal() {
		return autoRenewal;
	}

	public void setAutoRenewal(Boolean autoRenewal) {
		this.autoRenewal = autoRenewal;
	}

	public BigDecimal getMinBalanceRequired() {
		return minBalanceRequired;
	}

	public void setMinBalanceRequired(BigDecimal minBalanceRequired) {
		this.minBalanceRequired = minBalanceRequired;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
    
}
