package com.example.products.service;

import com.example.products.entity.Role;
import com.example.products.entity.Product;
import com.example.products.repository.RoleRepository;
import com.example.products.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ProductRepository productRepository;

    // Create role for a product
    public Role createRole(Long productId, Role role) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        role.setProduct(product);
        return roleRepository.save(role);
    }

    // Get roles by product
    public List<Role> getRolesByProduct(Long productId) {
        return roleRepository.findByProductProductId(productId);
    }

    // Update role
    public Role updateRole(Long roleId, Role updatedRole) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        role.setRoleName(updatedRole.getRoleName());
        role.setRoleDescription(updatedRole.getRoleDescription());
        role.setIsMandatory(updatedRole.getIsMandatory());
        role.setMaxCount(updatedRole.getMaxCount());
        return roleRepository.save(role);
    }

    // Delete role
    public void deleteRole(Long roleId) {
        roleRepository.deleteById(roleId);
    }
}
