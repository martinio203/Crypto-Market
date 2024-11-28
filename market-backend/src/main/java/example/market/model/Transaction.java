package example.market.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private LocalDateTime transactionDate;

    @ManyToOne
    @JoinColumn(name = "sell_currency_id", nullable = false)
    private Currency sellCurrency;

    @Column(nullable = false, precision = 38, scale = 10)
    private BigDecimal sellAmount;

    @ManyToOne
    @JoinColumn(name = "buy_currency_id", nullable = false)
    private Currency buyCurrency;

    @Column(nullable = false, precision = 38, scale = 10)
    private BigDecimal buyAmount;

}
