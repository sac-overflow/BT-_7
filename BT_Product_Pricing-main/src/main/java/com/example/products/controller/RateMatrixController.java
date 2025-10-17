package com.example.products.controller;

import com.example.products.entity.RateMatrix;
import com.example.products.service.RateMatrixService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/cdx-api/rate-matrix")
public class RateMatrixController {

    @Autowired
    private RateMatrixService rateMatrixService;

    @GetMapping
    public ResponseEntity<List<RateMatrix>> getAllRates() {
        return ResponseEntity.ok(rateMatrixService.getAllRates());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RateMatrix> getRateById(@PathVariable Long id) {
        return rateMatrixService.getRateById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<RateMatrix>> getRatesByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(rateMatrixService.getRatesByProductId(productId));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<RateMatrix>> getRatesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(rateMatrixService.getRatesByCustomerCategory(category));
    }

    @GetMapping("/active")
    public ResponseEntity<List<RateMatrix>> getActiveRates(@RequestParam String date) {
        LocalDate localDate = LocalDate.parse(date);
        return ResponseEntity.ok(rateMatrixService.getActiveRates(localDate));
    }

    @PostMapping
    public ResponseEntity<RateMatrix> createRate(@RequestBody RateMatrix rateMatrix) {
        return ResponseEntity.ok(rateMatrixService.saveRate(rateMatrix));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRate(@PathVariable Long id) {
        rateMatrixService.deleteRate(id);
        return ResponseEntity.noContent().build();
    }
}
