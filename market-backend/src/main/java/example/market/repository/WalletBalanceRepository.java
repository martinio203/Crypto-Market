package example.market.repository;

import example.market.model.Currency;
import example.market.model.User;
import example.market.model.Wallet;
import example.market.model.WalletBalance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WalletBalanceRepository extends JpaRepository<WalletBalance, Long> {
    WalletBalance findByWallet(Wallet wallet);
    List<WalletBalance> findWalletBalanceByWallet(Wallet wallet);
    Optional<WalletBalance> findWalletBalanceByWalletAndCurrency(Wallet wallet, Currency currency);
}
