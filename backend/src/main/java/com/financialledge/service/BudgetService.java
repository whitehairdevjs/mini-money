package com.financialledge.service;

import com.financialledge.entity.Budget;
import com.financialledge.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BudgetService {

    private final BudgetRepository budgetRepository;

    public List<Budget> getAllBudgets() {
        return budgetRepository.findAll();
    }

    public Budget getBudgetById(Long id) {
        return budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found with id: " + id));
    }

    public List<Budget> getBudgetsByCategoryId(Long categoryId) {
        return budgetRepository.findByCategoryId(categoryId);
    }

    public List<Budget> getBudgetsByAccountId(Long accountId) {
        return budgetRepository.findByAccountId(accountId);
    }

    public List<Budget> getActiveBudgets() {
        return budgetRepository.findByIsActiveTrue();
    }

    public List<Budget> getBudgetsByPeriodType(Budget.PeriodType periodType) {
        return budgetRepository.findByPeriodType(periodType);
    }

    @Transactional
    public Budget createBudget(Budget budget) {
        return budgetRepository.save(budget);
    }

    @Transactional
    public Budget updateBudget(Long id, Budget budget) {
        Budget existingBudget = getBudgetById(id);
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
    public void deleteBudget(Long id) {
        Budget budget = getBudgetById(id);
        budgetRepository.delete(budget);
    }
}

