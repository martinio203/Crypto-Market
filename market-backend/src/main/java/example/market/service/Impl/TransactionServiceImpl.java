package example.market.service.Impl;

import example.market.dto.CreateTransactionDto;
import example.market.dto.ResponseTransactionDto;
import example.market.model.Currency;
import example.market.model.Transaction;
import example.market.model.User;
import example.market.repository.CurrencyRepository;
import example.market.repository.TransactionRepository;
import example.market.repository.UserRepository;
import example.market.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;


@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final CurrencyRepository currencyRepository;

    @Override
    public void createTransaction(CreateTransactionDto transactionDto) {

        Currency sellCurrency = currencyRepository.findByCurrency(transactionDto.getSellCurrency())
                .orElseThrow(() -> new IllegalArgumentException("Sell currency not found"));

        Currency buyCurrency = currencyRepository.findByCurrency(transactionDto.getSellCurrency())
                .orElseThrow(() -> new IllegalArgumentException("Buy currency not found"));

        var transaction = Transaction.builder()
                .user(getUser())
                .transactionDate(LocalDateTime.now())
                .sellCurrency(sellCurrency)
                .sellAmount(transactionDto.getSellAmount())
                .buyCurrency(buyCurrency)
                .buyAmount(transactionDto.getBuyAmount())
                .build();

        transactionRepository.save(transaction);
    }

    @Override
    public List<ResponseTransactionDto> getUserTransactions() {
        List<Transaction> transactions = transactionRepository.findTransactionByUser(getUser());

        Collections.reverse(transactions);

        return transactions.stream().map(transaction -> new ResponseTransactionDto(
                transaction.getId(),
                transaction.getSellCurrency().getCurrency(),
                transaction.getSellAmount(),
                transaction.getBuyCurrency().getCurrency(),
                transaction.getBuyAmount(),
                transaction.getTransactionDate()
        )).toList();
    }

    public String getUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.getPrincipal() instanceof UserDetails userDetails) {
            return userDetails.getUsername();
        }
        return null;
    }

    public User getUser() {
        return userRepository.findByEmail(getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
