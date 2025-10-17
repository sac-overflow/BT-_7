package com.example.products.controller;

import com.example.products.entity.TransactionType;
import com.example.products.service.TransactionTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/cdx-api/transaction-types")
public class TransactionTypeController {

    @Autowired
    private TransactionTypeService service;

    @PostMapping("/add")
    public TransactionType addTransactionType(@RequestBody TransactionType txn) {
        return service.createTransactionType(txn);
    }

    @GetMapping("/product/{productId}")
    public List<TransactionType> getTransactionTypes(@PathVariable Long productId) {
        return service.getTransactionTypesByProduct(productId);
    }

    @PutMapping("/update/{txnTypeId}")
    public TransactionType updateTransactionType(@PathVariable Long txnTypeId, @RequestBody TransactionType txn) {
        return service.updateTransactionType(txnTypeId, txn);
    }

    @DeleteMapping("/delete/{txnTypeId}")
    public void deleteTransactionType(@PathVariable Long txnTypeId) {
        service.deleteTransactionType(txnTypeId);
    }
}
