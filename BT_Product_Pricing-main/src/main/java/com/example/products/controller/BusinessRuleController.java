package com.example.products.controller;

import com.example.products.entity.BusinessRule;
import com.example.products.service.BusinessRuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cdx-api/product-pricing/rules")
public class BusinessRuleController {

    @Autowired
    private BusinessRuleService service;

    @PostMapping("/add/{productId}")
    public BusinessRule addBusinessRule(@PathVariable Long productId, @RequestBody BusinessRule rule) {
        return service.createBusinessRule(productId, rule);
    }

    @GetMapping("/product/{productId}")
    public List<BusinessRule> getRulesByProduct(@PathVariable Long productId) {
        return service.getRulesByProduct(productId);
    }

    @PutMapping("/update/{ruleId}")
    public BusinessRule updateBusinessRule(@PathVariable Long ruleId, @RequestBody BusinessRule rule) {
        return service.updateBusinessRule(ruleId, rule);
    }

    @DeleteMapping("/delete/{ruleId}")
    public void deleteBusinessRule(@PathVariable Long ruleId) {
        service.deleteBusinessRule(ruleId);
    }
}
