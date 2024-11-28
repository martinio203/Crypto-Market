package example.market.request.user;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ExchangeRequest {
    private String sellCurrency;
    private String buyCurrency;
    private BigDecimal amount;
}
