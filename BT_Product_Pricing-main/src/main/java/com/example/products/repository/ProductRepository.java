package com.example.products.repository;

import com.example.products.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Search by product name
    List<Product> findByProductNameContainingIgnoreCase(String productName);

    // Products created today
    @Query("SELECT p FROM Product p WHERE DATE(p.createdAt) = CURRENT_DATE")
    List<Product> findProductsCreatedToday();

    // Products created this month
    @Query("SELECT p FROM Product p WHERE MONTH(p.createdAt) = MONTH(CURRENT_DATE) AND YEAR(p.createdAt) = YEAR(CURRENT_DATE)")
    List<Product> findProductsCreatedThisMonth();

    // Products created between dates
    @Query("SELECT p FROM Product p WHERE p.createdAt BETWEEN :start AND :end")
    List<Product> findProductsCreatedBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // Products by username (assuming you have a createdBy column later)
    @Query("SELECT p FROM Product p WHERE p.branch = :username")  // you can replace 'branch' with 'createdBy' if added later
    List<Product> findProductsByUser(@Param("username") String username);

    // Active products by type and date
    @Query("SELECT p FROM Product p WHERE p.productType = :type AND p.effectiveDate <= :date AND (p.expiryDate IS NULL OR p.expiryDate >= :date)")
    List<Product> findActiveProducts(@Param("date") LocalDate date, @Param("type") String type);
}
