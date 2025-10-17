package com.example.products.repository;

import com.example.products.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoleRepository extends JpaRepository<Role, Long> {
    List<Role> findByProductProductId(Long productId);
}
