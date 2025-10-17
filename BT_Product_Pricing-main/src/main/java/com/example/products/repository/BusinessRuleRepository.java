package com.example.products.repository;

import com.example.products.entity.BusinessRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface BusinessRuleRepository extends JpaRepository<BusinessRule, Long> {

    /**
     * Fetch all business rules linked to a specific product
     */
    List<BusinessRule> findByProductId(Long productId);

    /**
     * Fetch all interest rates for a given product
     * Returns a list because a product can have multiple rules
     */
    @Query("SELECT b.interestRate FROM BusinessRule b WHERE b.productId = :productId")
    List<BigDecimal> findInterestRateByProductId(@Param("productId") Long productId);

}
