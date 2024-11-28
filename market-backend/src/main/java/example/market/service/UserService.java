package example.market.service;

import example.market.dto.UserInfoDto;
import example.market.dto.UserWalletResponseDto;
import example.market.model.Currency;
import example.market.model.Transaction;
import example.market.model.User;
import example.market.request.user.ChangeEmailRequest;
import example.market.request.user.ChangePasswordRequest;
import example.market.request.user.ExchangeRequest;

import java.util.List;

public interface UserService {
    String getUsername();
    List<UserWalletResponseDto> getWallet();
    List<UserWalletResponseDto> exchange(ExchangeRequest request);
    List<Currency> getMarketCurrency();
    List<Currency> getUserCurrency();
    UserInfoDto getUserInfo();
    User changePassword(ChangePasswordRequest request);
    User changeEmail(ChangeEmailRequest request);
    User getUser();
}
