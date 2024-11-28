package example.market.service;

import example.market.dto.CreateTransactionDto;
import example.market.dto.ResponseTransactionDto;

import java.util.List;


public interface TransactionService {
    void createTransaction(CreateTransactionDto transactionDto);
    List<ResponseTransactionDto> getUserTransactions();

}
