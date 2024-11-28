package example.market.service.Impl;

import example.market.api.Market;
import example.market.dto.CreateTransactionDto;
import example.market.dto.UserInfoDto;
import example.market.dto.UserWalletResponseDto;
import example.market.model.*;
import example.market.model.Currency;
import example.market.repository.*;
import example.market.request.user.ChangeEmailRequest;
import example.market.request.user.ChangePasswordRequest;
import example.market.request.user.ExchangeRequest;
import example.market.service.TransactionService;
import example.market.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URISyntaxException;
import java.util.*;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final WalletBalanceRepository walletBalanceRepository;
    private final CurrencyRepository currencyRepository;
    private final TransactionService transactionService;
    private final Market market;
    private final PasswordEncoder passwordEncoder;

    @Override
    public String getUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.getPrincipal() instanceof UserDetails userDetails) {
            return userDetails.getUsername();
        }
        return null;
    }



    @Override
    public List<UserWalletResponseDto> getWallet() {
        List<UserWalletResponseDto> portfolio = new ArrayList<>();

        List<WalletBalance> walletBalances = getUserCurrencies();

        for (WalletBalance balance : walletBalances) {
            String currency = balance.getCurrency().getCurrency();
            String fullName = balance.getCurrency().getFullName();

            String amount = balance.getAmount()
                    .setScale(getScale(currency), RoundingMode.HALF_UP)
                    .stripTrailingZeros()
                    .toPlainString();

            portfolio.add(new UserWalletResponseDto(currency, fullName, new BigDecimal(amount)));
        }

        return portfolio;
    }

    private int getScale(String currency) {
        String type = currencyRepository.findByCurrency(currency).get().getType();
        return type.equalsIgnoreCase("FIAT") ? 2 : 8;
    }


    @Override
    @Transactional
    public List<UserWalletResponseDto> exchange(ExchangeRequest request) {

        Currency buyCurrency = currencyRepository.findByCurrency(request.getBuyCurrency())
                .orElseThrow(() -> new IllegalArgumentException("Buying currency does not exist"));

        Currency sellCurrency = currencyRepository.findByCurrency(request.getSellCurrency())
                .orElseThrow(() -> new IllegalArgumentException("Selling currency does not exist"));

        User user = userRepository.findByEmail(getUsername()).orElse(null);
        Wallet wallet = walletRepository.findWalletByUser(user);
        WalletBalance sellBalance = walletBalanceRepository.findWalletBalanceByWalletAndCurrency(wallet, sellCurrency)
                .orElseThrow(() -> new IllegalArgumentException("You don't have currency: " + sellCurrency));

        if (request.getAmount().compareTo(sellBalance.getAmount()) > 0){
            throw new IllegalArgumentException("Not enough balance");
        }

        BigDecimal newAmountSell = sellBalance.getAmount().subtract(request.getAmount());
        sellBalance.setAmount(newAmountSell);
        walletBalanceRepository.save(sellBalance);

        WalletBalance buyBalance = walletBalanceRepository.findWalletBalanceByWalletAndCurrency(wallet, buyCurrency)
                .orElse(WalletBalance.builder()
                                .wallet(wallet)
                                .currency(buyCurrency)
                                .amount(BigDecimal.ZERO)
                                .build()
                );

        BigDecimal receiveAmount = calculateExchange(buyCurrency.getCurrency(),
                sellCurrency.getCurrency(),
                request.getAmount());

        BigDecimal newAmountBuy = buyBalance.getAmount().add(receiveAmount);

        CreateTransactionDto transactionDetails = new CreateTransactionDto(
                request.getSellCurrency(),
                request.getAmount(),
                request.getBuyCurrency(),
                receiveAmount
        );

        buyBalance.setAmount(newAmountBuy);
        walletBalanceRepository.save(buyBalance);
        transactionService.createTransaction(transactionDetails);
        return getWallet();
    }

    @Override
    public List<Currency> getMarketCurrency() {
        System.out.println(currencyRepository.findAll());
        return currencyRepository.findAll();
    }

    @Override
    public List<Currency> getUserCurrency() {

        List<WalletBalance> walletBalances = getUserCurrencies();

        List<Currency> cryptocurrencies = new ArrayList<>();
        for (WalletBalance balance : walletBalances) {
            Currency currency = balance.getCurrency();
            cryptocurrencies.add(currency);
        }
        System.out.println(cryptocurrencies);
        return cryptocurrencies;
    }

    @Override
    public UserInfoDto getUserInfo() {
        User user = userRepository.findByEmail(getUsername()).
                orElseThrow(() -> new IllegalArgumentException("User not found"));
        return new UserInfoDto(user.getId(), user.getEmail());
    }

    @Override
    public User changePassword(ChangePasswordRequest request) {
        User user = userRepository.findByEmail(getUsername()).
                orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())){
            throw new IllegalArgumentException("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        return userRepository.save(user);
    }

    @Override
    public User changeEmail(ChangeEmailRequest request) {
        User user = getUser();

        if (userRepository.findByEmail(request.getNewEmail()).isPresent()) {
            throw new IllegalArgumentException("User with this email exists");
        }

        user.setEmail(request.getNewEmail());
        return userRepository.save(user);
    }

    //change findbyemail in methods
    @Override
    public User getUser() {
        return userRepository.findByEmail(getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private List<WalletBalance> getUserCurrencies() {
        Optional<User> user = userRepository.findByEmail(getUsername());
        if (user.isEmpty()) {
            return new ArrayList<>();
        }
        Wallet wallet = walletRepository.findWalletByUser(user.get());
        return walletBalanceRepository.findWalletBalanceByWallet(wallet);
    }

    private BigDecimal calculateExchange(String sellCurrency, String buyCurrency, BigDecimal amount) {
        try {
            BigDecimal rate = market.getRate(sellCurrency, buyCurrency);
            return rate.multiply(amount);
        } catch (URISyntaxException | IOException e) {
            throw new RuntimeException("Error fetching exchange rate: " + e.getMessage(), e);
        }
    }

}
