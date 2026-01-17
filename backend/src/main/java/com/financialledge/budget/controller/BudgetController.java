package com.financialledge.budget.controller;

import com.financialledge.auth.repository.UserRepository;
import com.financialledge.budget.entity.Budget;
import com.financialledge.budget.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;
    private final UserRepository userRepository;

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    @GetMapping
    public ResponseEntity<List<Budget>> getAllBudgets() {
        Long userId = getCurrentUserId();
        List<Budget> budgets = budgetService.getAllBudgets(userId);
        return ResponseEntity.ok(budgets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Budget> getBudgetById(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        Budget budget = budgetService.getBudgetById(id, userId);
        return ResponseEntity.ok(budget);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Budget>> getBudgetsByCategoryId(@PathVariable Long categoryId) {
        Long userId = getCurrentUserId();
        List<Budget> budgets = budgetService.getBudgetsByCategoryId(userId, categoryId);
        return ResponseEntity.ok(budgets);
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<Budget>> getBudgetsByAccountId(@PathVariable Long accountId) {
        Long userId = getCurrentUserId();
        List<Budget> budgets = budgetService.getBudgetsByAccountId(userId, accountId);
        return ResponseEntity.ok(budgets);
    }

    @GetMapping("/active")
    public ResponseEntity<List<Budget>> getActiveBudgets() {
        Long userId = getCurrentUserId();
        List<Budget> budgets = budgetService.getActiveBudgets(userId);
        return ResponseEntity.ok(budgets);
    }

    @GetMapping("/period/{periodType}")
    public ResponseEntity<List<Budget>> getBudgetsByPeriodType(
            @PathVariable Budget.PeriodType periodType) {
        Long userId = getCurrentUserId();
        List<Budget> budgets = budgetService.getBudgetsByPeriodType(userId, periodType);
        return ResponseEntity.ok(budgets);
    }

    @PostMapping
    public ResponseEntity<Budget> createBudget(@RequestBody Budget budget) {
        Long userId = getCurrentUserId();
        Budget createdBudget = budgetService.createBudget(budget, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBudget);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(
            @PathVariable Long id,
            @RequestBody Budget budget) {
        Long userId = getCurrentUserId();
        Budget updatedBudget = budgetService.updateBudget(id, budget, userId);
        return ResponseEntity.ok(updatedBudget);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        budgetService.deleteBudget(id, userId);
        return ResponseEntity.noContent().build();
    }
}
