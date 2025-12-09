package com.financialledge.repository;

import com.financialledge.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    
    List<Budget> findByCategoryId(Long categoryId);
    
    List<Budget> findByAccountId(Long accountId);
    
    List<Budget> findByIsActiveTrue();
    
    List<Budget> findByStartDateLessThanEqualAndEndDateGreaterThanEqual(
            LocalDate date1, LocalDate date2);
    
    List<Budget> findByPeriodType(Budget.PeriodType periodType);
}

