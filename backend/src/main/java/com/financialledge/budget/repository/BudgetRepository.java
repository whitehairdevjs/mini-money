package com.financialledge.budget.repository;

import com.financialledge.budget.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    
    List<Budget> findByUserId(Long userId);
    
    List<Budget> findByUserIdAndCategoryId(Long userId, Long categoryId);
    
    List<Budget> findByUserIdAndAccountId(Long userId, Long accountId);
    
    List<Budget> findByUserIdAndIsActiveTrue(Long userId);
    
    List<Budget> findByUserIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Long userId, LocalDate date1, LocalDate date2);
    
    List<Budget> findByUserIdAndPeriodType(Long userId, Budget.PeriodType periodType);
    
    // 기존 메서드들 (하위 호환성을 위해 유지, 하지만 사용하지 않는 것을 권장)
    @Deprecated
    List<Budget> findByCategoryId(Long categoryId);
    
    @Deprecated
    List<Budget> findByAccountId(Long accountId);
    
    @Deprecated
    List<Budget> findByIsActiveTrue();
    
    @Deprecated
    List<Budget> findByStartDateLessThanEqualAndEndDateGreaterThanEqual(
            LocalDate date1, LocalDate date2);
    
    @Deprecated
    List<Budget> findByPeriodType(Budget.PeriodType periodType);
}
