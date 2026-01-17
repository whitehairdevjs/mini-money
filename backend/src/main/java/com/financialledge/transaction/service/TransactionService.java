package com.financialledge.transaction.service;

import com.financialledge.auth.entity.User;
import com.financialledge.auth.repository.UserRepository;
import com.financialledge.transaction.entity.Transaction;
import com.financialledge.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public List<Transaction> getAllTransactions(Long userId) {
        return transactionRepository.findByUserIdOrderByTransactionDateDescAndUpdatedAtDesc(userId);
    }

    public Transaction getTransactionById(Long id, Long userId) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
        if (!transaction.getUserId().equals(userId)) {
            throw new RuntimeException("Transaction not found with id: " + id);
        }
        return transaction;
    }

    public List<Transaction> getTransactionsByType(Long userId, Transaction.TransactionType type) {
        return transactionRepository.findByUserIdAndTransactionType(userId, type);
    }

    public List<Transaction> getTransactionsByCategoryId(Long userId, Long categoryId) {
        return transactionRepository.findByUserIdAndCategoryId(userId, categoryId);
    }

    public List<Transaction> getTransactionsByAccountId(Long userId, Long accountId) {
        return transactionRepository.findByUserIdAndAccountId(userId, accountId);
    }

    @Transactional
    public Transaction createTransaction(Transaction transaction, Long userId) {
        User user = userRepository.getReferenceById(userId);
        transaction.setUser(user);
        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction updateTransaction(Long id, Transaction transaction, Long userId) {
        Transaction existingTransaction = getTransactionById(id, userId);
        existingTransaction.setTransactionDate(transaction.getTransactionDate());
        existingTransaction.setDescription(transaction.getDescription());
        existingTransaction.setAmount(transaction.getAmount());
        existingTransaction.setTransactionType(transaction.getTransactionType());
        existingTransaction.setCategory(transaction.getCategory());
        existingTransaction.setAccount(transaction.getAccount());
        existingTransaction.setTargetAccount(transaction.getTargetAccount());
        existingTransaction.setNotes(transaction.getNotes());
        return transactionRepository.save(existingTransaction);
    }

    @Transactional
    public void deleteTransaction(Long id, Long userId) {
        Transaction transaction = getTransactionById(id, userId);
        transactionRepository.delete(transaction);
    }
}
