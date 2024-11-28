package example.market.request.admin;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class AddUserBalanceRequest {
    String email;
    String currency;
    BigDecimal amount;
}
