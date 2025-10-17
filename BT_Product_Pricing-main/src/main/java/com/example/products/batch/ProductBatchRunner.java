package com.example.products.batch;

import com.example.products.entity.Product;
import com.example.products.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductBatchRunner implements CommandLineRunner {

    private final ProductRepository productRepository;

    public ProductBatchRunner(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== Running batch job: Valid Products ===");

        List<Product> validProducts = productRepository.findAll()
                .stream()
                .filter(p -> {
                    LocalDate today = LocalDate.now();
                    boolean afterEffective = !today.isBefore(p.getEffectiveDate());
                    boolean beforeExpiry = p.getExpiryDate() == null || !today.isAfter(p.getExpiryDate());
                    return afterEffective && beforeExpiry;
                })
                .collect(Collectors.toList());

        validProducts.forEach(p ->
                System.out.println("Valid Product: " + p.getProductName() + " | Code: " + p.getProductCode())
        );

        System.out.println("=== Batch job completed ===");
    }
}
