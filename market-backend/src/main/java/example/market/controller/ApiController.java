package example.market.controller;

import example.market.api.Market;
import example.market.dto.ResponseTopCurrenciesDto;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/market")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ApiController {

    private final Market market;

    @GetMapping("/btc-to-usd")
    public ResponseEntity<String> getBtcToUsd() {
        try {
            String data = market.getData("BTC/USD");
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/eth-to-usd")
    public ResponseEntity<String> getEthToUsd() {
        try {
            String data = market.getData("Eth/Usd");
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/rate")
    ResponseEntity<BigDecimal> getRate(@RequestParam String fromCurrency,
                                   @RequestParam String toCurrency) {
        try {
            return ResponseEntity.ok(market.getRate(toCurrency, fromCurrency).setScale(8, RoundingMode.HALF_UP));
        } catch (URISyntaxException | IOException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/currencyRate")
    ResponseEntity<Map<String, BigDecimal>> getCurrencyRate(@RequestParam List<String> fromCurrency,
                                         @RequestParam String toCurrency) {
        return ResponseEntity.ok(market.getCurrencyRate(fromCurrency, toCurrency));
    }

    @GetMapping("/assets")
    ResponseEntity<Map<String, BigDecimal>> getAssets(){
        try {
            return ResponseEntity.ok(market.assets());
        } catch (URISyntaxException | IOException e) {
            throw new RuntimeException(e);
        }
    }
}

