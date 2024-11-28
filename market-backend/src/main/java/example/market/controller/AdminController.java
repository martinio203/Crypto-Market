package example.market.controller;

import example.market.model.Currency;
import example.market.model.User;
import example.market.model.WalletBalance;
import example.market.request.AddUserRequest;
import example.market.request.RegisterRequest;
import example.market.request.admin.AddCurrencyRequest;
import example.market.request.admin.AddUserBalanceRequest;
import example.market.request.admin.DeleteUserRequest;
import example.market.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final AdminService adminService;


    @PostMapping("/addUserBalance")
    public ResponseEntity<WalletBalance> addUserBalance(@RequestBody AddUserBalanceRequest request){
        return ResponseEntity.ok(adminService.addUserBalance(request));
    }

    @PostMapping("/addCurrency")
    public ResponseEntity<Currency> addCurrency(@RequestBody AddCurrencyRequest request) {
        return ResponseEntity.ok(adminService.addCurrency(request));
    }

    @PostMapping("/deleteUser")
    public ResponseEntity<User> delete(@RequestBody DeleteUserRequest request) {
        return ResponseEntity.ok(adminService.deleteUser(request));
    }

    @PostMapping("/addUser")
    public ResponseEntity<String> addUser(@RequestBody AddUserRequest request) {
        return ResponseEntity.ok(adminService.createUser(request));
    }
}
