package com.example.products.service;

import com.example.products.entity.BusinessRule;
import com.example.products.repository.BusinessRuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BusinessRuleService {

    @Autowired
    private BusinessRuleRepository repository;

    // ---------------- Existing CRUD methods ----------------

    public BusinessRule createBusinessRule(Long productId, BusinessRule rule) {
        rule.setProductId(productId);
        return repository.save(rule);
    }

    public List<BusinessRule> getRulesByProduct(Long productId) {
        return repository.findByProductId(productId);
    }

    public BusinessRule updateBusinessRule(Long ruleId, BusinessRule updatedRule) {
        BusinessRule existing = repository.findById(ruleId)
                .orElseThrow(() -> new RuntimeException("BusinessRule not found with ID: " + ruleId));

        existing.setMinTerm(updatedRule.getMinTerm());
        existing.setMaxTerm(updatedRule.getMaxTerm());
        existing.setMinAmount(updatedRule.getMinAmount());
        existing.setMaxAmount(updatedRule.getMaxAmount());
        existing.setInterestRate(updatedRule.getInterestRate());
        existing.setCompoundingFrequency(updatedRule.getCompoundingFrequency());
        existing.setPrematureWithdrawalAllowed(updatedRule.getPrematureWithdrawalAllowed());
        existing.setPrematurePenaltyRate(updatedRule.getPrematurePenaltyRate());
        existing.setAutoRenewal(updatedRule.getAutoRenewal());
        existing.setMinBalanceRequired(updatedRule.getMinBalanceRequired());

        return repository.save(existing);
    }

    public void deleteBusinessRule(Long ruleId) {
        if (!repository.existsById(ruleId)) {
            throw new RuntimeException("BusinessRule not found with ID: " + ruleId);
        }
        repository.deleteById(ruleId);
    }

    // ---------------- New method for interest rates ----------------

    /**
     * Fetch all interest rates for a specific product
     */
    public List<BigDecimal> getInterestRatesByProduct(Long productId) {
        return repository.findInterestRateByProductId(productId);
    }
}
