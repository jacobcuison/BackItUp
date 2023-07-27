package com.BackItUp.orbital.controller;

import com.BackItUp.orbital.model.*;
import com.BackItUp.orbital.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(investmentController.class)
@Import(TestConfig.class) // Import the test configuration

class investmentControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private walletRepo WALLETRepository;
    @MockBean
    private paymentRepo paymentRepository;
    @MockBean

    private investmentRepo investmentRepository;
    @MockBean
    private postRepo postRepository;
    @MockBean
    private userRepo userRepository;
    @MockBean
    private shareRepo shareRepository;
    @MockBean
    private notificationRepo notificationRepository;

    Post PostOne;
    User userOne;
    User CompanyOne;
    Share ShareOne;
    Post postOne;


    @BeforeEach
    void setUp() {

        this.userOne = new User("Jacky", "jacky@gmail.com", "8175422", "password", "Founder", "", "linkedin.com", true);
        userOne.setUserID(1);
        Wallet walletOne = new Wallet(500,0);
        walletOne.setWallet_ID(1);
        userOne.setWallet(walletOne);

        this.CompanyOne= new User("CompanyA","companyA@gmail.com","8175422","password","linkedin.com",true);
        Wallet walletTwo = new Wallet(500,0);
        walletTwo.setWallet_ID(2);
        CompanyOne.setWallet(walletTwo);

        PostCreation PostCreationOne = new PostCreation("Title1", "Description1","Content1","url.com",true,1,5000,10,0,10, LocalDateTime.now(),LocalDateTime.now(),LocalDateTime.now());

        this.ShareOne = new Share(CompanyOne,PostCreationOne.getShareCountTotal(),PostCreationOne.getShareCountMin(),PostCreationOne.getShareCountCurrent(),PostCreationOne.getShareCountPrice());
        ShareOne.setShareId(1);

        this.postOne = new Post(CompanyOne, ShareOne,PostCreationOne);
        postOne.setPostID(1);

        Investment investment = new Investment(userOne, ShareOne, 10, Payment payment, LocalDateTime investDt, boolean investActive) {


        when(userRepository.findById(1)).thenReturn(Optional.ofNullable(userOne));
        when(userRepository.findById(2)).thenReturn(Optional.ofNullable(CompanyOne));

        when(shareRepository.findById(1)).thenReturn(Optional.ofNullable(ShareOne));


    }

//    @Test
    void invest() throws Exception {
        double amount = 10;
        this.mockMvc.perform(get("/api/invest/"+ShareOne.getShareId()+"/"+userOne.getUserID()+"/"+amount+"/2023-06-25T10:00:00"))
                .andDo(print()).andExpect(status().isOk());

    }

    @GetMapping("/api/listinvest/user/{userid}")
    List<Investment> userListInvest(@PathVariable("userid") Integer UserID){
        Optional<User> optionalUser = userRepository.findById(UserID);

        if (optionalUser.isEmpty()) {
            return null;
        }

        return investmentRepository.findInvestmentByUser(optionalUser.get());
    }

}