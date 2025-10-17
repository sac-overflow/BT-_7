package com.example.products.service;

import com.example.products.entity.Product;
import com.example.products.repository.BusinessRuleRepository;
import com.example.products.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BusinessRuleRepository businessRuleRepository;

    // ------------------ Existing CRUD ------------------

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product saveProduct(Product product) {
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

    public Optional<Product> updateProduct(Long id, Product updatedProduct) {
        return productRepository.findById(id).map(existing -> {
            updatedProduct.setProductId(id);
            updatedProduct.setUpdatedAt(LocalDateTime.now());
            return productRepository.save(updatedProduct);
        });
    }

    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Product> searchProductsByName(String name) {
        return productRepository.findByProductNameContainingIgnoreCase(name);
    }

    // ------------------ New Analytics ------------------

    public List<Product> getProductsCreatedToday() {
        return productRepository.findProductsCreatedToday();
    }

    public List<Product> getProductsCreatedThisMonth() {
        return productRepository.findProductsCreatedThisMonth();
    }

    public List<Product> getProductsBetween(LocalDate start, LocalDate end) {
        LocalDateTime startTime = start.atStartOfDay();
        LocalDateTime endTime = end.atTime(23, 59, 59);
        return productRepository.findProductsCreatedBetween(startTime, endTime);
    }

    public List<Product> getProductsByUser(String username) {
        return productRepository.findProductsByUser(username);
    }

    public List<Product> getActiveProducts(LocalDate date, String productType) {
        return productRepository.findActiveProducts(date, productType);
    }

    public BigDecimal getInterestRate(Long productId) {
        List<BigDecimal> rates = businessRuleRepository.findInterestRateByProductId(productId);
        if (rates != null && !rates.isEmpty()) {
            return rates.get(0);  // Return first rate (or implement logic to pick the correct one)
        }
        return BigDecimal.ZERO; // or null if no rate found
    }
}
