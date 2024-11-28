package example.market.service.Impl;

import example.market.model.*;
import example.market.repository.CurrencyRepository;
import example.market.repository.WalletBalanceRepository;
import example.market.request.AuthenticationRequest;
import example.market.request.RegisterRequest;
import example.market.repository.UserRepository;
import example.market.repository.WalletRepository;
import example.market.service.AuthenticationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtServiceImpl jwtService;
    private final AuthenticationManager authManager;
    private final WalletRepository walletRepository;
    private final WalletBalanceRepository walletBalanceRepository;
    private final CurrencyRepository currencyRepository;

    @Override
    @Transactional
    public String register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User already exist");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())){
            System.out.println(request.getPassword() + request.getConfirmPassword());
            throw new IllegalArgumentException("Passwords do not match");
        }

        var user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        userRepository.save(user);

        var wallet = Wallet.builder()
                .user(user)
                .build();
        walletRepository.save(wallet);

        walletBalanceRepository.save(addBalance(wallet, new BigDecimal(10000)
                .setScale(2, RoundingMode.HALF_UP)));

        return jwtService.generateTokenWithRole(user, user.getRole());
    }


    private WalletBalance addBalance(Wallet wallet, BigDecimal amount){
        var currency = currencyRepository.findByCurrency("USD")
                .orElseGet(() -> {
                    var newCurrency = Currency.builder()
                            .currency("USD")
                            .fullName("USD")
                            .type("FIAT")
                            .build();
                    currencyRepository.save(newCurrency);
                    return newCurrency;
                });

        return WalletBalance.builder()
                .wallet(wallet)
                .currency(currency)
                .amount(amount)
                .build();
    }

    @Override
    public String authenticate(AuthenticationRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() ->
                new IllegalArgumentException("Invalid user's email or password")
        );

        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword())
        );

        return jwtService.generateTokenWithRole(user, user.getRole());
    }

}
