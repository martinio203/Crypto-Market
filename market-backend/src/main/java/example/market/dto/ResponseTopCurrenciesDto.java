package example.market.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class ResponseTopCurrenciesDto {
    private String symbol;
    private BigDecimal price;
}
