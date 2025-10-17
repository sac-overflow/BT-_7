package com.example.products.controller;

import com.example.products.entity.Product;
import com.example.products.service.BusinessRuleService;
import com.example.products.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/cdx-api/reports")
public class ReportController {

    @Autowired
    private ProductService productService;

    @Autowired
    private BusinessRuleService businessRuleService;

    // -------------------- Product Reports --------------------

    // Products created today
    @GetMapping("/products-created-today")
    public ResponseEntity<List<Product>> productsCreatedToday() {
        return ResponseEntity.ok(productService.getProductsCreatedToday());
    }

    // Products created this month
    @GetMapping("/products-created-this-month")
    public ResponseEntity<List<Product>> productsCreatedThisMonth() {
        return ResponseEntity.ok(productService.getProductsCreatedThisMonth());
    }

    // Products created between two dates
    @GetMapping("/products-between")
    public ResponseEntity<List<Product>> productsBetween(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        return ResponseEntity.ok(productService.getProductsBetween(start, end));
    }

    // Products created by a given user
    @GetMapping("/products-by-user")
    public ResponseEntity<List<Product>> productsByUser(@RequestParam("username") String username) {
        return ResponseEntity.ok(productService.getProductsByUser(username));
    }

    // Active products on a given date for a product type
    @GetMapping("/active-products")
    public ResponseEntity<List<Product>> activeProducts(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("productType") String productType
    ) {
        return ResponseEntity.ok(productService.getActiveProducts(date, productType));
    }

    // -------------------- Interest Rate Reports --------------------

    // Interest rate matrix for a product
    @GetMapping("/interest-rate-matrix/{productId}")
    public ResponseEntity<List<BigDecimal>> interestRateMatrix(@PathVariable Long productId) {
        return ResponseEntity.ok(businessRuleService.getInterestRatesByProduct(productId));
    }
}
