package com.financialledge.repository;

import com.financialledge.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByUserId(Long userId);
    
    Optional<Transaction> findByIdAndUserId(Long id, Long userId);
    
    List<Transaction> findByUserIdAndTransactionType(Long userId, Transaction.TransactionType transactionType);
    
    List<Transaction> findByUserIdAndCategoryId(Long userId, Long categoryId);
    
    List<Transaction> findByUserIdAndAccountId(Long userId, Long accountId);
    
    List<Transaction> findByUserIdAndTransactionDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
    
    List<Transaction> findByUserIdAndTransactionTypeAndCategoryId(Long userId, Transaction.TransactionType transactionType, Long categoryId);
    
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId ORDER BY t.transactionDate DESC, t.updatedAt DESC")
    List<Transaction> findByUserIdOrderByTransactionDateDescAndUpdatedAtDesc(Long userId);
}

