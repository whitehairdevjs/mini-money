package com.financialledge.budget.service;

import com.financialledge.auth.entity.User;
import com.financialledge.auth.repository.UserRepository;
import com.financialledge.budget.entity.Budget;
import com.financialledge.budget.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;

    public List<Budget> getAllBudgets(Long userId) {
        return budgetRepository.findByUserId(userId);
    }

    public Budget getBudgetById(Long id, Long userId) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found with id: " + id));
        if (!budget.getUserId().equals(userId)) {
            throw new RuntimeException("Budget not found with id: " + id);
        }
        return budget;
    }

    public List<Budget> getBudgetsByCategoryId(Long userId, Long categoryId) {
        return budgetRepository.findByUserIdAndCategoryId(userId, categoryId);
    }

    public List<Budget> getBudgetsByAccountId(Long userId, Long accountId) {
        return budgetRepository.findByUserIdAndAccountId(userId, accountId);
    }

    public List<Budget> getActiveBudgets(Long userId) {
        return budgetRepository.findByUserIdAndIsActiveTrue(userId);
    }

    public List<Budget> getBudgetsByPeriodType(Long userId, Budget.PeriodType periodType) {
        return budgetRepository.findByUserIdAndPeriodType(userId, periodType);
    }

    @Transactional
    public Budget createBudget(Budget budget, Long userId) {
        User user = userRepository.getReferenceById(userId);
        budget.setUser(user);
        return budgetRepository.save(budget);
    }

    @Transactional
    public Budget updateBudget(Long id, Budget budget, Long userId) {
        Budget existingBudget = getBudgetById(id, userId);
        existingBudget.setCategory(budget.getCategory());
        existingBudget.setAccount(budget.getAccount());
        existingBudget.setAmount(budget.getAmount());
        existingBudget.setPeriodType(budget.getPeriodType());
        existingBudget.setStartDate(budget.getStartDate());
        existingBudget.setEndDate(budget.getEndDate());
        existingBudget.setIsActive(budget.getIsActive());
        return budgetRepository.save(existingBudget);
    }

    @Transactional
    public void deleteBudget(Long id, Long userId) {
        Budget budget = getBudgetById(id, userId);
        budgetRepository.delete(budget);
    }
}
