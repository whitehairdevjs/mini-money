package com.financialledge.transaction.repository;

import com.financialledge.transaction.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByUserId(Long userId);
    
    List<Transaction> findByUserIdAndTransactionType(Long userId, Transaction.TransactionType transactionType);
    
    List<Transaction> findByUserIdAndCategoryId(Long userId, Long categoryId);
    
    List<Transaction> findByUserIdAndAccountId(Long userId, Long accountId);
    
    List<Transaction> findByUserIdAndTransactionDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
    
    List<Transaction> findByUserIdAndTransactionTypeAndCategoryId(Long userId, Transaction.TransactionType transactionType, Long categoryId);
    
    @Query("SELECT t FROM Transaction t WHERE t.userId = :userId ORDER BY t.transactionDate DESC, t.updatedAt DESC")
    List<Transaction> findByUserIdOrderByTransactionDateDescAndUpdatedAtDesc(Long userId);
    
    // 기존 메서드들 (하위 호환성을 위해 유지, 하지만 사용하지 않는 것을 권장)
    @Deprecated
    List<Transaction> findByTransactionType(Transaction.TransactionType transactionType);
    
    @Deprecated
    List<Transaction> findByCategoryId(Long categoryId);
    
    @Deprecated
    List<Transaction> findByAccountId(Long accountId);
    
    @Deprecated
    List<Transaction> findByTransactionDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Deprecated
    List<Transaction> findByTransactionTypeAndCategoryId(Transaction.TransactionType transactionType, Long categoryId);
    
    @Deprecated
    @Query("SELECT t FROM Transaction t ORDER BY t.transactionDate DESC, t.updatedAt DESC")
    List<Transaction> findAllOrderByTransactionDateDescAndUpdatedAtDesc();
}
