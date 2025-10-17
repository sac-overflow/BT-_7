package com.example.products.repository;

import com.example.products.entity.Charge;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChargeRepository extends JpaRepository<Charge, Long> {
    List<Charge> findByProductId(Long productId);
}
