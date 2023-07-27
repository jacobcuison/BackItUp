package com.BackItUp.orbital.controller;

import com.BackItUp.orbital.controller.TestConfig;
import com.BackItUp.orbital.controller.withdrawalController;
import com.BackItUp.orbital.model.*;
import com.BackItUp.orbital.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import static org.springframework.http.RequestEntity.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(withdrawalController.class)
@Import(TestConfig.class) // Import the test configuration
class withdrawalControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private userRepo userRepository; // Assuming the userRepo interface is correctly named and imported.
    @MockBean
    private walletRepo WALLETRepository;
    @MockBean
    private notificationRepo notificationRepository;
    @MockBean
    private withdrawalRepo withdrawalRepository;


    Wallet WalletOne;
    Wallet WalletTwo;

    Withdrawal withdrawalOne;
    Withdrawal withdrawalTwo;

    WithdrawalResponse WithdrawalRespOne;
    WithdrawalResponse WithdrawalRespTwo;

    User userOne;
    User userTwo;

    List withdrawalLists = new ArrayList<>();

    @BeforeEach
    void setUp() {
        this.WalletOne = new Wallet(10, 0);
        this.WalletOne.setWallet_ID(1);

        this.WalletTwo = new Wallet(10, 0);
        this.WalletTwo.setWallet_ID(2);
        when(WALLETRepository.findById(1)).thenReturn(Optional.ofNullable(WalletOne));
        when(WALLETRepository.findById(2)).thenReturn(Optional.ofNullable(WalletTwo));

        this.WithdrawalRespOne = new WithdrawalResponse(1, 5, 8173213, LocalDateTime.now(), 0);
        this.WithdrawalRespTwo = new WithdrawalResponse(2, 5, 8173213, LocalDateTime.now(), 0);

        this.withdrawalOne = new Withdrawal(WalletOne, WithdrawalRespOne.getWithdrawalAmount(), WithdrawalRespOne.getWithdrawalPaynow(), WithdrawalRespOne.getWithdrawalDT(),WithdrawalRespOne.isWithdrawalVerified());
        this.withdrawalTwo = new Withdrawal(WalletTwo, WithdrawalRespTwo.getWithdrawalAmount(), WithdrawalRespTwo.getWithdrawalPaynow(), WithdrawalRespTwo.getWithdrawalDT(),WithdrawalRespTwo.isWithdrawalVerified());
        withdrawalOne.setWithdrawalID(1);
        withdrawalTwo.setWithdrawalID(2);

        this.userOne = new User("Jason", "jason@gmail.com", "8175422", "password", "Founder", "", "linkedin.com", true);
        this.userTwo = new User("Jacky", "jacky@gmail.com", "8175422", "password", "Founder", "", "linkedin.com", true);

        userOne.setWallet(WalletOne);
        userOne.setUserID(1);
        userTwo.setWallet(WalletTwo);
        userTwo.setUserID(2);

        withdrawalLists.add(withdrawalOne);
        withdrawalLists.add(withdrawalTwo);

        when(withdrawalRepository.findById(2)).thenReturn(Optional.ofNullable(withdrawalOne));
        when(withdrawalRepository.findById(2)).thenReturn(Optional.ofNullable(withdrawalTwo));

        when(userRepository.findById(1)).thenReturn(Optional.ofNullable(userOne));
        when(userRepository.findById(2)).thenReturn(Optional.ofNullable(userTwo));

        when(withdrawalRepository.findAll()).thenReturn(this.withdrawalLists);

    }

    //    @Test
    void newWithdrawal() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.WRAP_ROOT_VALUE,false);
        ObjectWriter ow = mapper.writer().withDefaultPrettyPrinter();
        String requestJSON = ow.writeValueAsString(WithdrawalRespOne);

//        this.mockMvc.perform(post("/api/withdrawal")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(requestJSON))
//                .andDo((print())).andExpect(status().isOk());

    }

    @Test
    void verifyPost() throws Exception {

        Withdrawal withdrawal = this.withdrawalOne;
        when(withdrawalRepository.findById(1)).thenReturn(Optional.ofNullable(withdrawal));

        this.mockMvc.perform(get("/api/withdrawal/verify/"+withdrawal.getWithdrawalID()+"/2023-06-25T10:00:00"))
                .andDo(print()).andExpect(status().isOk());


    }
    @Test
    void unverifyPost() throws Exception {
        Withdrawal withdrawal = this.withdrawalOne;
        when(withdrawalRepository.findById(1)).thenReturn(Optional.ofNullable(withdrawal));

        this.mockMvc.perform(get("/api/withdrawal/unverify/"+withdrawal.getWithdrawalID()+"/2023-06-25T10:00:00"))
                .andDo(print()).andExpect(status().isOk());

    }

    @Test
    void check() throws Exception {
        when(withdrawalRepository.findByWallet(WalletOne)).thenReturn(List.of(withdrawalOne));

        this.mockMvc.perform(get("/api/listWithdrawal/"+WalletOne.getWallet_ID()))
                .andDo(print()).andExpect(status().isOk());

    }

    @Test
    void getAllTopUp() throws Exception {
        this.mockMvc.perform(get("/api/listWithdrawal"))
                .andDo(print()).andExpect(status().isOk());

    }
  
}