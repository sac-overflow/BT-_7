package com.example.products.service;

import com.example.products.entity.Charge;
import com.example.products.repository.ChargeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ChargeService {

    @Autowired
    private ChargeRepository repository;

    public Charge createCharge(Charge charge) {
        return repository.save(charge);
    }

    public List<Charge> getChargesByProduct(Long productId) {
        return repository.findByProductId(productId);
    }

    public Charge updateCharge(Long id, Charge charge) {
        charge.setChargeId(id);
        return repository.save(charge);
    }

    public void deleteCharge(Long id) {
        repository.deleteById(id);
    }
}
