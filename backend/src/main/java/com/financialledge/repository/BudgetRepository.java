package com.financialledge.repository;

import com.financialledge.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    
    List<Budget> findByUserId(Long userId);
    
    Optional<Budget> findByIdAndUserId(Long id, Long userId);
    
    List<Budget> findByUserIdAndCategoryId(Long userId, Long categoryId);
    
    List<Budget> findByUserIdAndAccountId(Long userId, Long accountId);
    
    List<Budget> findByUserIdAndIsActiveTrue(Long userId);
    
    List<Budget> findByUserIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Long userId, LocalDate date1, LocalDate date2);
    
    List<Budget> findByUserIdAndPeriodType(Long userId, Budget.PeriodType periodType);
}

