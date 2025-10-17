package com.example.products.service;

import com.example.products.entity.TransactionType;
import com.example.products.repository.TransactionTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TransactionTypeService {

    @Autowired
    private TransactionTypeRepository repository;

    public TransactionType createTransactionType(TransactionType txn) {
        return repository.save(txn);
    }

    public List<TransactionType> getTransactionTypesByProduct(Long productId) {
        return repository.findByProductId(productId);
    }

    public TransactionType updateTransactionType(Long id, TransactionType txn) {
        txn.setTxnTypeId(id);
        return repository.save(txn);
    }

    public void deleteTransactionType(Long id) {
        repository.deleteById(id);
    }
}
