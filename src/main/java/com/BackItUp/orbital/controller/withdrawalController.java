package com.BackItUp.orbital.controller;

import com.BackItUp.orbital.model.*;
import com.BackItUp.orbital.repository.withdrawalRepo;
import com.BackItUp.orbital.repository.walletRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
public class withdrawalController {
    @Autowired
    private walletRepo WALLETRepository;
    @Autowired
    private withdrawalRepo withdrawalRepository;
    @PostMapping("/api/withdrawal")
    Withdrawal newWithdrawal(@RequestBody WithdrawalResponse response) {

        Wallet wallet = WALLETRepository.findById(response.getWalletID()).get();

        Withdrawal withdrawal = new Withdrawal(wallet, response.getWithdrawalAmount(),response.getWithdrawalPaynow(),response.getWithdrawalDT(), response.isWithdrawalVerified());

        return withdrawalRepository.save(withdrawal);
    }
    @GetMapping("/api/withdrawal/{verification}/{id}/{dt}")
    boolean verifyWithdrawal(@PathVariable("id") Integer withID, @PathVariable("dt") LocalDateTime dt, @PathVariable("verification") String verification) {
        Withdrawal withdrawal = withdrawalRepository.findById(withID).get();

        if(withdrawal == null || withdrawal.isPendingStatus()) {
            return false;
        }

        if(verification == "verify"){
            withdrawal.verify(dt);
        }else if( verification == "unverify"){
            withdrawal.unverify(dt);
        }else{
            return false;
        }


        withdrawalRepository.save(withdrawal);
        return true;
    }
}
