package example.market.repository;

import example.market.model.User;
import example.market.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WalletRepository extends JpaRepository<Wallet, Long> {
    Wallet findWalletByUser(User user);
}
