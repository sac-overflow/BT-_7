package com.example.products.repository;

import com.example.products.entity.RateMatrix;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface RateMatrixRepository extends JpaRepository<RateMatrix, Long> {
    List<RateMatrix> findByProduct_ProductId(Long productId);
    List<RateMatrix> findByCustomerCategoryIgnoreCase(String category);
    List<RateMatrix> findByEffectiveDateBeforeAndExpiryDateAfter(LocalDate currentDate1, LocalDate currentDate2);
}
