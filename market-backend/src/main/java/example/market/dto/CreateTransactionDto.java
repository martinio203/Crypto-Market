package example.market.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class CreateTransactionDto {

    private String sellCurrency;
    private BigDecimal sellAmount;

    private String buyCurrency;
    private BigDecimal buyAmount;
}
