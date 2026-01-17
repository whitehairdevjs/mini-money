package com.financialledge.transaction.controller;

import com.financialledge.auth.repository.UserRepository;
import com.financialledge.transaction.entity.Transaction;
import com.financialledge.transaction.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final UserRepository userRepository;

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        Long userId = getCurrentUserId();
        List<Transaction> transactions = transactionService.getAllTransactions(userId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        Transaction transaction = transactionService.getTransactionById(id, userId);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Transaction>> getTransactionsByType(
            @PathVariable Transaction.TransactionType type) {
        Long userId = getCurrentUserId();
        List<Transaction> transactions = transactionService.getTransactionsByType(userId, type);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Transaction>> getTransactionsByCategoryId(
            @PathVariable Long categoryId) {
        Long userId = getCurrentUserId();
        List<Transaction> transactions = transactionService.getTransactionsByCategoryId(userId, categoryId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<Transaction>> getTransactionsByAccountId(
            @PathVariable Long accountId) {
        Long userId = getCurrentUserId();
        List<Transaction> transactions = transactionService.getTransactionsByAccountId(userId, accountId);
        return ResponseEntity.ok(transactions);
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction) {
        Long userId = getCurrentUserId();
        Transaction createdTransaction = transactionService.createTransaction(transaction, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTransaction);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(
            @PathVariable Long id,
            @RequestBody Transaction transaction) {
        Long userId = getCurrentUserId();
        Transaction updatedTransaction = transactionService.updateTransaction(id, transaction, userId);
        return ResponseEntity.ok(updatedTransaction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        transactionService.deleteTransaction(id, userId);
        return ResponseEntity.noContent().build();
    }
}
