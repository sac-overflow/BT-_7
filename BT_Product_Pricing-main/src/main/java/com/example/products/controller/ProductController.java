package com.example.products.controller;

import com.example.products.entity.Product;
import com.example.products.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/cdx-api/product-pricing")
@CrossOrigin(origins = "http://localhost:3000") // enable React connection
public class ProductController {

    @Autowired
    private ProductService productService;

    // ----------------- CRUD -----------------

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.saveProduct(product));
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return productService.updateProduct(id, product)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        return productService.deleteProduct(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String name) {
        List<Product> products = productService.searchProductsByName(name);
        return ResponseEntity.ok(products);
    }

    // ----------------- Analytics -----------------

    // 1️⃣ Products created today
    @GetMapping("/created/today")
    public ResponseEntity<List<Product>> getProductsCreatedToday() {
        return ResponseEntity.ok(productService.getProductsCreatedToday());
    }

    // 2️⃣ Products created this month
    @GetMapping("/created/month")
    public ResponseEntity<List<Product>> getProductsCreatedThisMonth() {
        return ResponseEntity.ok(productService.getProductsCreatedThisMonth());
    }

    // 3️⃣ Products created between dates
    @GetMapping("/created/between")
    public ResponseEntity<List<Product>> getProductsBetween(
            @RequestParam LocalDate start,
            @RequestParam LocalDate end) {
        return ResponseEntity.ok(productService.getProductsBetween(start, end));
    }

    // 4️⃣ Products created by a specific user
    @GetMapping("/created/by")
    public ResponseEntity<List<Product>> getProductsByUser(@RequestParam String username) {
        return ResponseEntity.ok(productService.getProductsByUser(username));
    }

    // 5️⃣ Active products on a given date (by type)
    @GetMapping("/active")
    public ResponseEntity<List<Product>> getActiveProducts(
            @RequestParam LocalDate date,
            @RequestParam String type) {
        return ResponseEntity.ok(productService.getActiveProducts(date, type));
    }

    // 6️⃣ Interest rate for a given product
    @GetMapping("/{productId}/interest-rate")
    public ResponseEntity<BigDecimal> getInterestRate(@PathVariable Long productId) {
        BigDecimal rate = productService.getInterestRate(productId);
        return rate != null ? ResponseEntity.ok(rate) : ResponseEntity.notFound().build();
    }
}
