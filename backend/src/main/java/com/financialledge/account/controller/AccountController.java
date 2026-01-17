package com.financialledge.account.controller;

import com.financialledge.account.entity.Account;
import com.financialledge.account.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts() {
        List<Account> accounts = accountService.getAllAccounts();
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccountById(@PathVariable Long id) {
        Account account = accountService.getAccountById(id);
        return ResponseEntity.ok(account);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Account>> getAccountsByType(
            @PathVariable Account.AccountType type) {
        List<Account> accounts = accountService.getAccountsByType(type);
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/active")
    public ResponseEntity<List<Account>> getActiveAccounts() {
        List<Account> accounts = accountService.getActiveAccounts();
        return ResponseEntity.ok(accounts);
    }

    @PostMapping
    public ResponseEntity<Account> createAccount(@RequestBody Account account) {
        Account createdAccount = accountService.createAccount(account);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAccount);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Account> updateAccount(
            @PathVariable Long id,
            @RequestBody Account account) {
        Account updatedAccount = accountService.updateAccount(id, account);
        return ResponseEntity.ok(updatedAccount);
    }

    @PutMapping("/{id}/balance")
    public ResponseEntity<Account> updateBalance(
            @PathVariable Long id,
            @RequestBody BigDecimal balance) {
        Account updatedAccount = accountService.updateBalance(id, balance);
        return ResponseEntity.ok(updatedAccount);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long id) {
        accountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }
}
