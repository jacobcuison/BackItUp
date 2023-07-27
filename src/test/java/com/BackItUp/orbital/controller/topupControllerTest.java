package com.BackItUp.orbital.controller;

import com.BackItUp.orbital.model.*;
import com.BackItUp.orbital.repository.notificationRepo;
import com.BackItUp.orbital.repository.topupRepo;
import com.BackItUp.orbital.repository.userRepo;
import com.BackItUp.orbital.repository.walletRepo;
import com.fasterxml.jackson.core.JsonProcessingException;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(topupController.class)
@Import(TestConfig.class) // Import the test configuration

class topupControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private userRepo userRepository; // Assuming the userRepo interface is correctly named and imported.
    @MockBean
    private walletRepo WALLETRepository;
    @MockBean
    private notificationRepo notificationRepository;
    @MockBean
    private topupRepo topupRepository;


    Wallet WalletOne;
    Wallet WalletTwo;

    Topup topupOne;
    Topup topupTwo;

    TopupResponse TopupRespOne;
    TopupResponse TopupRespTwo;

    User userOne;
    User userTwo;

    List topupLists = new ArrayList<>();

    @BeforeEach
    void setUp() {
        this.WalletOne = new Wallet(10, 0);
        this.WalletOne.setWallet_ID(1);

        this.WalletTwo = new Wallet(10, 0);
        this.WalletTwo.setWallet_ID(2);
        when(WALLETRepository.findById(1)).thenReturn(Optional.ofNullable(WalletOne));
        when(WALLETRepository.findById(2)).thenReturn(Optional.ofNullable(WalletTwo));

        this.TopupRespOne = new TopupResponse(1, 5, 8173213, LocalDateTime.now(), 0, "test");
        this.TopupRespTwo = new TopupResponse(2, 5, 8173213, LocalDateTime.now(), 0, "test");

        this.topupOne = new Topup(WalletOne, TopupRespOne.getTopupAmount(), TopupRespOne.getTopupPaynow(), TopupRespOne.isTopupVerified(), TopupRespOne.getTopupDT(), TopupRespOne.getTopupEvidence());
        this.topupTwo = new Topup(WalletTwo, TopupRespTwo.getTopupAmount(), TopupRespTwo.getTopupPaynow(), TopupRespTwo.isTopupVerified(), TopupRespTwo.getTopupDT(), TopupRespTwo.getTopupEvidence());
        topupOne.setTopupID(1);
        topupTwo.setTopupID(2);

        this.userOne = new User("Jason", "jason@gmail.com", "8175422", "password", "Founder", "", "linkedin.com", true);
        this.userTwo = new User("Jacky", "jacky@gmail.com", "8175422", "password", "Founder", "", "linkedin.com", true);

        userOne.setWallet(WalletOne);
        userOne.setUserID(1);
        userTwo.setWallet(WalletTwo);
        userTwo.setUserID(2);

        topupLists.add(topupOne);
        topupLists.add(topupTwo);

        when(topupRepository.findById(2)).thenReturn(Optional.ofNullable(topupOne));
        when(topupRepository.findById(2)).thenReturn(Optional.ofNullable(topupTwo));

        when(userRepository.findById(1)).thenReturn(Optional.ofNullable(userOne));
        when(userRepository.findById(2)).thenReturn(Optional.ofNullable(userTwo));

        when(topupRepository.findAll()).thenReturn(this.topupLists);

    }

//    @Test
    void newTopup() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.WRAP_ROOT_VALUE,false);
        ObjectWriter ow = mapper.writer().withDefaultPrettyPrinter();
        String requestJSON = ow.writeValueAsString(TopupRespOne);

        this.mockMvc.perform(post("/api/topup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJSON))
                .andDo((print())).andExpect(status().isOk());

    }

    @Test
    void verifyPost() throws Exception {

        Topup topup = this.topupOne;
        when(topupRepository.findById(1)).thenReturn(Optional.ofNullable(topup));

        this.mockMvc.perform(get("/api/topup/verify/"+topup.getTopupID()+"/2023-06-25T10:00:00"))
                .andDo(print()).andExpect(status().isOk());


    }
    @Test
    void unverifyPost() throws Exception {
        Topup topup = this.topupOne;
        when(topupRepository.findById(1)).thenReturn(Optional.ofNullable(topup));

        this.mockMvc.perform(get("/api/topup/unverify/"+topup.getTopupID()+"/2023-06-25T10:00:00"))
                .andDo(print()).andExpect(status().isOk());

    }

    @Test
    void check() throws Exception {
        when(topupRepository.findByWallet(WalletOne)).thenReturn(List.of(topupOne));

        this.mockMvc.perform(get("/api/listTopUp/"+WalletOne.getWallet_ID()))
                .andDo(print()).andExpect(status().isOk());

    }

    @Test
    void getAllTopUp() throws Exception {
        this.mockMvc.perform(get("/api/listTopup"))
                .andDo(print()).andExpect(status().isOk());

    }
}