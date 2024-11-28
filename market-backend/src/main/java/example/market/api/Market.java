package example.market.api;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class Market {

    @Value("${api.key}")
    private String API_KEY;

    private JSONObject getJsonObject(String pattern) throws URISyntaxException, IOException {
        URL url = new URI("https://rest.coinapi.io/v1/" + pattern).toURL();
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestProperty("X-CoinAPI-key", API_KEY);

        BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        String inputLine;
        StringBuilder content = new StringBuilder();
        while ((inputLine = in.readLine()) != null) {
            content.append(inputLine);
        }

        in.close();
        connection.disconnect();

        return new JSONObject(content.toString());
    }

    public String getData(String pattern) throws Exception {
        pattern = "exchangerate/" + pattern;
        JSONObject json = getJsonObject(pattern);
        String time = json.getString("time");
        String rate = String.format("%.2f", json.getDouble("rate"));

        ZonedDateTime zonedDateTime = ZonedDateTime.parse(time).plusHours(2);

        String date = zonedDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        String timeFormated = zonedDateTime.format(DateTimeFormatter.ofPattern("HH:mm:ss"));

        return "Date: " + date + " Time: " + timeFormated + " Rate: " + rate;
    }

    public BigDecimal getRate(String sellCurrency, String buyCurrency) throws URISyntaxException, IOException {
        String exchange = buyCurrency + "/" + sellCurrency;
        String pattern = String.format("exchangerate/%s", exchange);
        JSONObject json = getJsonObject(pattern);
        return json.getBigDecimal("rate");
    }

    public Map<String, BigDecimal> getCurrencyRate(List<String> fromCurrency, String toCurrency)  {
        Map<String, BigDecimal> currencyRate = new HashMap<>();
        for (String currency : fromCurrency) {
            BigDecimal rate;
            try {
                rate = getRate(currency, toCurrency).setScale(8, RoundingMode.HALF_UP);
            } catch (URISyntaxException | IOException e) {
                throw new RuntimeException(e);
            }
            System.out.println(currency + " " + rate);
            currencyRate.put(currency, rate);
        }
        return currencyRate;
    }

    public Map<String, BigDecimal> assets() throws URISyntaxException, IOException {
        Set<String> topCurrencies = Set.of("BTC", "BNB", "DOGE", "ETH");
        Map<String, BigDecimal> topCurrenciesResponse = new HashMap<>();

        for (String currency : topCurrencies) {
            JSONObject rates = getJsonObject(String.format("exchangerate/%s/USD", currency));
            BigDecimal price = rates.getBigDecimal("rate").setScale(2, RoundingMode.HALF_UP);

            topCurrenciesResponse.put(currency, price);
        }
        return topCurrenciesResponse;
    }

}
