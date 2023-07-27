package com.BackItUp.orbital.controller;

import com.BackItUp.orbital.model.User;
import com.BackItUp.orbital.repository.notificationRepo;
import com.BackItUp.orbital.repository.userRepo;
import com.BackItUp.orbital.repository.walletRepo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(userController.class)
@Import(TestConfig.class) // Import the test configuration
class userControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private userRepo userRepository; // Assuming the userRepo interface is correctly named and imported.
    @MockBean
    private walletRepo WALLETRepository;
    @MockBean
    private notificationRepo notificationRepository;
    @MockBean
    private userController usercontroller;

    private User FounderOne;
    private User FounderTwo;
    private User InvestorOne;
    private User CompanyOne;
    private User OAuthOne;
    private List<User> UserLists = new ArrayList<>();



    @BeforeEach
    void setup(){
        this.CompanyOne= new User("CompanyA","companyA@gmail.com","8175422","password","linkedin.com",true);
        this.FounderOne = new User("Jason","jason@gmail.com","8175422","password","Founder","","linkedin.com",true);
        this.FounderTwo = new User("Jacky","jacky@gmail.com","8175422","password","Founder","","linkedin.com",true);
        this.InvestorOne = new User("Nick","nick@gmail.com","8175422","password","Investor","","linkedin.com",true);
        this.OAuthOne = new User("FBKim","kim@gmail.com","8175422","password","Founder","GOOGLE","link","","linkedin.com",true);

        this.FounderOne.setUserID(1);
        this.FounderOne.setUserVerified(1);
        this.InvestorOne.setUserID(2);
        this.CompanyOne.setUserID(3);
        this.OAuthOne.setUserID(4);

        this.FounderTwo.setUserID(5);

        UserLists.add(FounderOne);
        UserLists.add(FounderTwo);
        UserLists.add(InvestorOne);
        UserLists.add(CompanyOne);
        UserLists.add(OAuthOne);

        when(userRepository.findById(1)).thenReturn(Optional.ofNullable(this.FounderOne));
        when(userRepository.findById(2)).thenReturn(Optional.ofNullable(this.InvestorOne));
        when(userRepository.findById(3)).thenReturn(Optional.ofNullable(this.CompanyOne));
        when(userRepository.findById(4)).thenReturn(Optional.ofNullable(this.OAuthOne));
        when(userRepository.findAll()).thenReturn(this.UserLists);


    }
    @Test
    void newUser() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.WRAP_ROOT_VALUE,false);
        ObjectWriter ow = mapper.writer().withDefaultPrettyPrinter();
        String requestJSON = ow.writeValueAsString(FounderOne);

        this.mockMvc.perform(post("/api/createUser")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJSON))
                .andDo((print())).andExpect(status().isOk());
    }

    @Test
    void createUserbyAuth() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.WRAP_ROOT_VALUE,false);
        ObjectWriter ow = mapper.writer().withDefaultPrettyPrinter();
        String requestJSON = ow.writeValueAsString(OAuthOne);

        this.mockMvc.perform(post("/api/createUserbyAuth")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJSON))
                .andDo((print())).andExpect(status().isOk());

    }

    //
    @Test
    void newCompany() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.WRAP_ROOT_VALUE,false);
        ObjectWriter ow = mapper.writer().withDefaultPrettyPrinter();
        String requestJSON = ow.writeValueAsString(CompanyOne);

        when(userRepository.findById(1)).thenReturn(Optional.ofNullable(FounderOne));
        this.mockMvc.perform(post("/api/createCompany/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJSON))
                .andDo((print())).andExpect(status().isOk());
    }

//    Not Working
    @Test
    void testSubmitEvidence() throws Exception {
        // Mock your userRepository and controller

        // Create a mock MultipartFile with some test content
        String fileContent = "Test file content";
        MockMultipartFile file = new MockMultipartFile("file", "test.txt",
                "text/plain", fileContent.getBytes());


        // Call the submitEvidence method using mockMvc
        this.mockMvc.perform(MockMvcRequestBuilders.multipart("/api/user/submitEvidence/1")
                        .file(file)
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                    .andExpect(MockMvcResultMatchers.status().isOk());
        // Verify the result
//        assertEquals("/images/evidence/" + getExpectedFileName(), result);
    }


    @Test
    void submitPhoto() throws Exception {
        // Create a mock MultipartFile with some test content
        String fileContent = "Test file content";
        MockMultipartFile file = new MockMultipartFile("file", "test.txt",
                "text/plain", fileContent.getBytes());


        // Call the submitPhoto  method using mockMvc
        this.mockMvc.perform(MockMvcRequestBuilders.multipart("/api/user/submitPhoto/1")
                        .file(file)
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(MockMvcResultMatchers.status().isOk());

    }

    @Test
    void getUnverifiedFounders() throws Exception {
        when(userRepository.findByUserTypeAndUserVerified("Founder", 0)).thenReturn(List.of(FounderTwo));

        this.mockMvc.perform(get("/api/unverifiedFounder"))
                .andDo(print()).andExpect(status().isOk());
    }

    //Login
    @Test
    void verifyUser() throws Exception {
        when(userRepository.findByUserEmailAndUserPass(FounderOne.getUserEmail(),FounderOne.getUserPass())).thenReturn(Optional.ofNullable(FounderOne));

        this.mockMvc.perform(get("/api/verifyUser/"+FounderOne.getUserEmail()+"/"+FounderOne.getUserPass()))
                .andDo(print()).andExpect(status().isOk());

    }

    @Test
    void verifyCompany() throws Exception {
        User user = this.CompanyOne;

        when(userRepository.findByUserEmailAndUserPass(user.getUserEmail(),user.getUserPass())).thenReturn(Optional.ofNullable(user));

        this.mockMvc.perform(get("/api/verifyCompany/"+user.getUserEmail()+"/"+user.getUserPass()))
                .andDo(print()).andExpect(status().isOk());
    }

    @Test
    void verifyFounder() throws Exception {
        User user = this.FounderOne;

        when(userRepository.findByUserEmailAndUserPass(user.getUserEmail(),user.getUserPass())).thenReturn(Optional.ofNullable(user));

        this.mockMvc.perform(get("/api/verifyFounder/"+user.getUserEmail()+"/"+user.getUserPass()))
                .andDo(print()).andExpect(status().isOk());

    }

    @Test
    void verifyUserbyAuth() throws Exception {
        User user = this.OAuthOne;

        when(userRepository.findByUserOauthIdentifierAndUserOauthType(user.getUserOauthIdentifier(),user.getUserOauthType())).thenReturn(Optional.of(user));

        this.mockMvc.perform(get("/api/verifyUserbyAuth/"+user.getUserOauthIdentifier()+"/"+user.getUserOauthType()))
                .andDo(print()).andExpect(status().isOk());
    }

    @Test
    void getUser() throws Exception {
        User user = this.FounderTwo;

        when(userRepository.findById(user.getUserID())).thenReturn(Optional.of(user));

        this.mockMvc.perform(get("/api/user/"+user.getUserID()))
                .andDo(print()).andExpect(status().isOk());

    }

    @Test
    void testVerifyUser() throws Exception {
        User user = this.FounderTwo;


        this.mockMvc.perform(get("/api/"+user.getUserID()+"/verify"))
                .andDo(print()).andExpect(status().isOk());


    }

    @Test
    void unverifyUser() throws Exception {
        User user = this.FounderTwo;


        this.mockMvc.perform(get("/api/"+user.getUserID()+"/unverify"))
                .andDo(print()).andExpect(status().isOk());
    }

    @Test
    void getAllUsers() throws Exception {
        this.mockMvc.perform(get("/api/users"))
                .andDo(print()).andExpect(status().isOk());

    }

    @Test
    void findExistedEmail() {

    }
}