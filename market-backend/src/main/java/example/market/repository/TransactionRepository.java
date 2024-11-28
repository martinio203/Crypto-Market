package example.market.repository;

import example.market.model.Transaction;
import example.market.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findTransactionByUser(User user);
}
