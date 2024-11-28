package example.market.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class UserWalletResponseDto {
    private String currency;
    private String fullName;
    private BigDecimal amount;
}
