package com.financialledge.category.repository;

import com.financialledge.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    Optional<Category> findByName(String name);
    
    List<Category> findByTransactionType(Category.TransactionType transactionType);
    
    List<Category> findByParentId(Long parentId);
    
    List<Category> findByParentIsNull();
}
