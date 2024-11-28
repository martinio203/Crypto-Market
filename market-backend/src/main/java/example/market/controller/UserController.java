package example.market.controller;


import example.market.dto.UserInfoDto;
import example.market.dto.UserWalletResponseDto;
import example.market.model.Currency;
import example.market.model.Transaction;
import example.market.model.User;
import example.market.repository.UserRepository;
import example.market.request.user.ChangeEmailRequest;
import example.market.request.user.ChangePasswordRequest;
import example.market.request.user.ExchangeRequest;
import example.market.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    @GetMapping("/getAll")
    ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/userInfo")
    ResponseEntity<String> userInfo() {
        return ResponseEntity.ok(userService.getUsername());
    }

    @GetMapping("/getWallet")
    ResponseEntity<List<UserWalletResponseDto>> getUserWallet() {
        return ResponseEntity.ok(userService.getWallet());
    }


    @PostMapping("/exchange")
    ResponseEntity<List<UserWalletResponseDto>> exchange(@RequestBody ExchangeRequest request) {
        return ResponseEntity.ok(userService.exchange(request));
    }

    @GetMapping("/userCurrency")
    ResponseEntity<List<Currency>> getUserCurrency() {
        return ResponseEntity.ok(userService.getUserCurrency());
    }

    @GetMapping("/marketCurrency")
    ResponseEntity<List<Currency>> getMarketCurrency() {
        return ResponseEntity.ok(userService.getMarketCurrency());
    }

    @GetMapping("/userDetails")
    ResponseEntity<UserInfoDto> getUserDetails() {
        return ResponseEntity.ok(userService.getUserInfo());
    }

    @PostMapping("/changePassword")
    ResponseEntity<User> changePassword(@RequestBody ChangePasswordRequest request) {
        return ResponseEntity.ok(userService.changePassword(request));
    }

    @PostMapping("/changeEmail")
    ResponseEntity<User> changeEmail(@RequestBody ChangeEmailRequest request) {
        return ResponseEntity.ok(userService.changeEmail(request));
    }

}
