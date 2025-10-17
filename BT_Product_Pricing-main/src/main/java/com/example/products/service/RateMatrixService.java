package com.example.products.service;

import com.example.products.entity.RateMatrix;
import com.example.products.repository.RateMatrixRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class RateMatrixService {

    @Autowired
    private RateMatrixRepository rateMatrixRepository;

    public List<RateMatrix> getAllRates() {
        return rateMatrixRepository.findAll();
    }

    public Optional<RateMatrix> getRateById(Long id) {
        return rateMatrixRepository.findById(id);
    }

    public List<RateMatrix> getRatesByProductId(Long productId) {
        return rateMatrixRepository.findByProduct_ProductId(productId);
    }

    public List<RateMatrix> getRatesByCustomerCategory(String category) {
        return rateMatrixRepository.findByCustomerCategoryIgnoreCase(category);
    }

    public List<RateMatrix> getActiveRates(LocalDate date) {
        return rateMatrixRepository.findByEffectiveDateBeforeAndExpiryDateAfter(date, date);
    }

    public RateMatrix saveRate(RateMatrix rateMatrix) {
        return rateMatrixRepository.save(rateMatrix);
    }

    public void deleteRate(Long id) {
        rateMatrixRepository.deleteById(id);
    }
}
