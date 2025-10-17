package com.example.products.controller;

import com.example.products.entity.Role;
import com.example.products.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cdx-api/product-pricing/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;

    // Add a new role to a product
    @PostMapping("/add/{productId}")
    public Role addRole(@PathVariable Long productId, @RequestBody Role role) {
        return roleService.createRole(productId, role);
    }

    // Get all roles for a product
    @GetMapping("/product/{productId}")
    public List<Role> getRolesByProduct(@PathVariable Long productId) {
        return roleService.getRolesByProduct(productId);
    }

    // Update a role
    @PutMapping("/update/{roleId}")
    public Role updateRole(@PathVariable Long roleId, @RequestBody Role role) {
        return roleService.updateRole(roleId, role);
    }

    // Delete a role
    @DeleteMapping("/delete/{roleId}")
    public void deleteRole(@PathVariable Long roleId) {
        roleService.deleteRole(roleId);
    }
}
