package com.BackItUp.orbital.controller;

import com.BackItUp.orbital.model.Notification;
import com.BackItUp.orbital.model.User;
import com.BackItUp.orbital.model.Withdrawal;
import com.BackItUp.orbital.repository.notificationRepo;
import com.BackItUp.orbital.repository.userRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(notificationController.class)
@Import(TestConfig.class) // Import the test configuration
class notificationControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private userRepo userRepository;
    @MockBean
    private notificationRepo notificationRepository;

    User userOne;
    Notification notificationOne;
    Notification notificationTwo;
    Notification notificationThree;
    List<Notification> notificationAll = new ArrayList<>();
    List<Notification> notificationRead = new ArrayList<>();
    List<Notification> notificationunRead = new ArrayList<>();



    @BeforeEach
    void setUp() {
        this.userOne = new User("Jacky", "jacky@gmail.com", "8175422", "password", "Founder", "", "linkedin.com", true);
        userOne.setUserID(1);
        this.notificationOne = Notification.sendVerifiedNotification(userOne);
        notificationOne.setNotificationID(1);
        this.notificationTwo = Notification.sendNotification(userOne,"test","test", LocalDateTime.now());
        notificationTwo.setNotificationID(2);
        this.notificationThree = Notification.sendNotification(userOne,"test","test", LocalDateTime.now());
        notificationThree.setNotificationID(3);

        this.notificationTwo.readNotification();
        this.notificationThree.readNotification();

        notificationAll.add(notificationOne);
        notificationAll.add(notificationTwo);
        notificationAll.add(notificationThree);

        notificationRead.add(notificationOne);
        notificationunRead.add(notificationTwo);
        notificationunRead.add(notificationThree);

        when(notificationRepository.findById(1)).thenReturn(Optional.ofNullable(notificationOne));
        when(notificationRepository.findById(2)).thenReturn(Optional.ofNullable(notificationTwo));
        when(notificationRepository.findById(3)).thenReturn(Optional.ofNullable(notificationThree));

        when(userRepository.findById(1)).thenReturn(Optional.ofNullable(userOne));
        when(notificationRepository.findByUser(userOne)).thenReturn(notificationAll);
    }

    @Test
    void listAllNotification() throws Exception {

        this.mockMvc.perform(get("/api/listNotification/all/"+userOne.getUserID()))
                .andDo(print()).andExpect(status().isOk());

    }

    @Test
    void readNotification() throws Exception {
        this.mockMvc.perform(get("/api/readNotification/"+notificationOne.getNotificationID()))
                .andDo(print()).andExpect(status().isOk());

    }

    @Test
    void unreadNotification() throws Exception {
        this.mockMvc.perform(get("/api/unreadNotification/"+notificationOne.getNotificationID()))
                .andDo(print()).andExpect(status().isOk());

    }
}