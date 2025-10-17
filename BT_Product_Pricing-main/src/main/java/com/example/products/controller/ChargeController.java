package com.example.products.controller;

import com.example.products.entity.Charge;
import com.example.products.service.ChargeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/cdx-api/charges")
public class ChargeController {

    @Autowired
    private ChargeService service;

    @PostMapping("/add")
    public Charge addCharge(@RequestBody Charge charge) {
        return service.createCharge(charge);
    }

    @GetMapping("/product/{productId}")
    public List<Charge> getCharges(@PathVariable Long productId) {
        return service.getChargesByProduct(productId);
    }

    @PutMapping("/update/{chargeId}")
    public Charge updateCharge(@PathVariable Long chargeId, @RequestBody Charge charge) {
        return service.updateCharge(chargeId, charge);
    }

    @DeleteMapping("/delete/{chargeId}")
    public void deleteCharge(@PathVariable Long chargeId) {
        service.deleteCharge(chargeId);
    }
}
