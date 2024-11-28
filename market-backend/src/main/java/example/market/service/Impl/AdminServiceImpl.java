package example.market.service.Impl;

import example.market.model.*;
import example.market.repository.*;
import example.market.request.AddUserRequest;
import example.market.request.RegisterRequest;
import example.market.request.admin.AddCurrencyRequest;
import example.market.request.admin.AddUserBalanceRequest;
import example.market.request.admin.DeleteUserRequest;
import example.market.service.AdminService;
import example.market.service.TransactionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final WalletRepository walletRepository;
    private final UserRepository userRepository;
    private final CurrencyRepository currencyRepository;
    private final WalletBalanceRepository walletBalanceRepository;
    private final PasswordEncoder passwordEncoder;
    private final TransactionRepository transactionRepository;

    @Override
    public Currency addCurrency(AddCurrencyRequest request) {
        if (currencyRepository.findByCurrency(request.getCurrency()).isEmpty()){
            var currency = Currency.builder()
                .currency(request.getCurrency())
                    .type(request.getType())
                    .fullName(request.getFullName())
                .build();
            return currencyRepository.save(currency);

        }
        throw new IllegalArgumentException("Currency exists");
    }

    @Override
    @Transactional
    public WalletBalance addUserBalance(AddUserBalanceRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Could not find user"));

        Wallet wallet = walletRepository.findWalletByUser(user);
        return walletBalanceRepository.save(
                addBalance(wallet, request.getCurrency(), request.getAmount())
        );

    }

    private WalletBalance addBalance(Wallet wallet, String currencyName, BigDecimal amount){
        var currency = currencyRepository.findByCurrency(currencyName)
                .orElseThrow(() -> new IllegalArgumentException("Currency does not exist")
                );

        WalletBalance walletBalance = walletBalanceRepository.findWalletBalanceByWalletAndCurrency(wallet, currency)
                .orElse(WalletBalance.builder()
                        .wallet(wallet)
                        .currency(currency)
                        .amount(BigDecimal.ZERO)
                        .build()
                );



        BigDecimal newAmount = walletBalance.getAmount().add(amount);
        walletBalance.setAmount(newAmount);

        return walletBalance;
    }

    @Override
    public String createUser(AddUserRequest request) {
        System.out.println(request.getEmail());
        if (userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new IllegalArgumentException("User exists");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())){
            throw new IllegalArgumentException("Passwords do not match");
        }

        var user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.valueOf(request.getRole()))
                .build();

        userRepository.save(user);
        return "User added";
    }

    @Override
    @Transactional
    public User deleteUser(DeleteUserRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(
                () -> new IllegalArgumentException("User does not exist")
        );

        if (!request.getEmail().equals(request.getConfirmEmail())) {
            throw new IllegalArgumentException("Emails are not the same");
        }

        if (user.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException("Cannot delete admin user");
        }

        Wallet wallet = walletRepository.findWalletByUser(user);
        transactionRepository.deleteAll(transactionRepository.findTransactionByUser(user));
        walletBalanceRepository.deleteAll(walletBalanceRepository.findWalletBalanceByWallet(wallet));
        walletRepository.delete(wallet);
        userRepository.delete(user);
        return user;
    }

}
