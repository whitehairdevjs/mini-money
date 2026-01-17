package com.financialledge.category.repository;

import com.financialledge.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    List<Category> findByUserId(Long userId);
    
    Optional<Category> findByIdAndUserId(Long id, Long userId);
    
    Optional<Category> findByUserIdAndName(Long userId, String name);
    
    List<Category> findByUserIdAndTransactionType(Long userId, Category.TransactionType transactionType);
    
    List<Category> findByUserIdAndParentId(Long userId, Long parentId);
    
    List<Category> findByUserIdAndParentIsNull(Long userId);
}
