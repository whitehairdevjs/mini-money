package com.financialledge.controller;

import com.financialledge.entity.Budget;
import com.financialledge.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @GetMapping
    public ResponseEntity<List<Budget>> getAllBudgets() {
        List<Budget> budgets = budgetService.getAllBudgets();
        return ResponseEntity.ok(budgets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Budget> getBudgetById(@PathVariable Long id) {
        Budget budget = budgetService.getBudgetById(id);
        return ResponseEntity.ok(budget);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Budget>> getBudgetsByCategoryId(@PathVariable Long categoryId) {
        List<Budget> budgets = budgetService.getBudgetsByCategoryId(categoryId);
        return ResponseEntity.ok(budgets);
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<Budget>> getBudgetsByAccountId(@PathVariable Long accountId) {
        List<Budget> budgets = budgetService.getBudgetsByAccountId(accountId);
        return ResponseEntity.ok(budgets);
    }

    @GetMapping("/active")
    public ResponseEntity<List<Budget>> getActiveBudgets() {
        List<Budget> budgets = budgetService.getActiveBudgets();
        return ResponseEntity.ok(budgets);
    }

    @GetMapping("/period/{periodType}")
    public ResponseEntity<List<Budget>> getBudgetsByPeriodType(
            @PathVariable Budget.PeriodType periodType) {
        List<Budget> budgets = budgetService.getBudgetsByPeriodType(periodType);
        return ResponseEntity.ok(budgets);
    }

    @PostMapping
    public ResponseEntity<Budget> createBudget(@RequestBody Budget budget) {
        Budget createdBudget = budgetService.createBudget(budget);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBudget);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(
            @PathVariable Long id,
            @RequestBody Budget budget) {
        Budget updatedBudget = budgetService.updateBudget(id, budget);
        return ResponseEntity.ok(updatedBudget);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.noContent().build();
    }
}

