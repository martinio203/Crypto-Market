package example.market.controller;

import example.market.dto.CreateTransactionDto;
import example.market.dto.ResponseTransactionDto;
import example.market.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transaction")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {
    private final TransactionService transactionService;

    @GetMapping("/userTransactions")
    ResponseEntity<List<ResponseTransactionDto>> getUserTransactions() {
        return ResponseEntity.ok(transactionService.getUserTransactions());
    }

}
