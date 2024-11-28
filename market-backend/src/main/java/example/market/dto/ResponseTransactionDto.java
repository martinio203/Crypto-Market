package example.market.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ResponseTransactionDto {
    private Long id;

    private String sellCurrency;
    private BigDecimal sellAmount;

    private String buyCurrency;
    private BigDecimal buyAmount;

    private LocalDateTime date;
}
