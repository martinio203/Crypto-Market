package example.market.service;

import example.market.model.Currency;
import example.market.model.User;
import example.market.model.WalletBalance;
import example.market.request.AddUserRequest;
import example.market.request.RegisterRequest;
import example.market.request.admin.AddCurrencyRequest;
import example.market.request.admin.AddUserBalanceRequest;
import example.market.request.admin.DeleteUserRequest;

public interface AdminService {
    Currency addCurrency(AddCurrencyRequest request);
    WalletBalance addUserBalance(AddUserBalanceRequest request);
    String createUser(AddUserRequest request);
    User deleteUser(DeleteUserRequest request);
}
