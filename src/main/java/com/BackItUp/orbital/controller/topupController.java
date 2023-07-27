package com.BackItUp.orbital.controller;

import com.BackItUp.orbital.model.*;
import com.BackItUp.orbital.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("https://backitup.mysql.database.azure.com/")
public class topupController {
    @Autowired
    private walletRepo WALLETRepository;
    @Autowired
    private topupRepo topupRepository;
    @Autowired
    private userRepo userRepository;
    @Autowired
    private notificationRepo notificationRepository;

//    @BeforeEach
//    void setUp() {
//        this.mockMvc = MockMvcBuilders.standaloneSetup(new topupController(WALLETRepository, topupRepository, userRepository, notificationRepository)).build();
//
//        this.WalletOne = new Wallet(10, 0);
//        this.WalletOne.setWallet_ID(1);
//
//        this.WalletTwo = new Wallet(10, 0);
//        this.WalletTwo.setWallet_ID(2);
//
//        this.TopupRespOne = new TopupResponse(1, 5, 8173213, LocalDateTime.now(), 0, "test");
//        this.TopupRespTwo = new TopupResponse(2, 5, 8173213, LocalDateTime.now(), 0, "test");
//
//        this.topupOne = new Topup(WalletOne, TopupRespOne.getTopupAmount(), TopupRespOne.getTopupPaynow(), TopupRespOne.isTopupVerified(), TopupRespOne.getTopupDT(), TopupRespOne.getTopupEvidence());
//        this.topupTwo = new Topup(WalletTwo, TopupRespTwo.getTopupAmount(), TopupRespTwo.getTopupPaynow(), TopupRespTwo.isTopupVerified(), TopupRespTwo.getTopupDT(), TopupRespTwo.getTopupEvidence());
//
//        this.userOne = new User("Jason", "jason@gmail.com", "8175422", "password", "Founder", "", "linkedin.com", true);
//        this.userTwo = new User("Jacky", "jacky@gmail.com", "8175422", "password", "Founder", "", "linkedin.com", true);
//
//        userOne.setWallet(WalletOne);
//        userOne.setUserID(1);
//        userTwo.setWallet(WalletTwo);
//        userTwo.setUserID(2);
//
//        when(topupRepository.findById(2)).thenReturn(Optional.ofNullable(topupOne));
//        when(topupRepository.findById(2)).thenReturn(Optional.ofNullable(topupTwo));
//
//        when(userRepository.findById(1)).thenReturn(Optional.ofNullable(userOne));
//        when(userRepository.findById(2)).thenReturn(Optional.ofNullable(userTwo));
//
//    }
        @PostMapping("/api/topup")
    Topup newTopup(@RequestBody TopupResponse response) {

        Wallet wallet = WALLETRepository.findById(response.getWalletID()).get();
        double amount = response.getTopupAmount();

        if(amount < 0){
            return null;
        }

        Topup topup = new Topup(wallet, amount, response.getTopupPaynow() ,response.isTopupVerified(),response.getTopupDT(),response.getTopupEvidence());

        return topupRepository.save(topup);
    }

    @GetMapping("/api/topup/{verification}/{id}/{dt}")
    boolean verifyTopup(@PathVariable("id") Integer topID, @PathVariable("dt") LocalDateTime dt, @PathVariable("verification") String verification) {
        Topup topup = topupRepository.findById(topID).get();

        if(topup == null){
            System.out.println(topup.toString());
            return false;
        }

        if(verification.equals("verify")){
            topup.verify(dt);

            Wallet wallet = topup.getWallet();
            double amount = topup.getTopupAmount();

            wallet.addActiveBalance(amount);
            WALLETRepository.save(wallet);


            User user = userRepository.findByWallet(wallet);

            notificationRepository.save(Notification.sendTopupSuccessNotification(user,topup));

        }else if(verification.equals("unverify")){
            topup.unverify(dt);
        }else{

            return false;
        }


        topupRepository.save(topup);
        return true;
    }

    @GetMapping("/api/listTopUp/{wallet_id}")
    List<Topup> check(@PathVariable("wallet_id") Integer walletID){
        Wallet wallet = WALLETRepository.findById(walletID).get();

        return topupRepository.findByWallet(wallet);
    }

    @GetMapping("/api/listTopup")
    List<Topup> getAllTopUp() {

        return topupRepository.findAll();
    }

}
