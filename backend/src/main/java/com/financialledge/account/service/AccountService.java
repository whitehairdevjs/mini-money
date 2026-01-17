package com.financialledge.account.service;

import com.financialledge.account.entity.Account;
import com.financialledge.account.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AccountService {

    private final AccountRepository accountRepository;

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    public Account getAccountById(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + id));
    }

    public List<Account> getAccountsByType(Account.AccountType accountType) {
        return accountRepository.findByAccountType(accountType);
    }

    public List<Account> getActiveAccounts() {
        return accountRepository.findByIsActiveTrue();
    }

    @Transactional
    public Account createAccount(Account account) {
        return accountRepository.save(account);
    }

    @Transactional
    public Account updateAccount(Long id, Account account) {
        Account existingAccount = getAccountById(id);
        existingAccount.setName(account.getName());
        existingAccount.setAccountType(account.getAccountType());
        existingAccount.setBalance(account.getBalance());
        existingAccount.setCurrency(account.getCurrency());
        existingAccount.setDescription(account.getDescription());
        existingAccount.setIsActive(account.getIsActive());
        return accountRepository.save(existingAccount);
    }

    @Transactional
    public void deleteAccount(Long id) {
        Account account = getAccountById(id);
        accountRepository.delete(account);
    }

    @Transactional
    public Account updateBalance(Long id, java.math.BigDecimal newBalance) {
        Account account = getAccountById(id);
        account.setBalance(newBalance);
        return accountRepository.save(account);
    }
}
