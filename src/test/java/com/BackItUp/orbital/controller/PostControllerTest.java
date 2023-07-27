package com.BackItUp.orbital.controller;

import com.BackItUp.orbital.model.*;
import com.BackItUp.orbital.repository.notificationRepo;
import com.BackItUp.orbital.repository.postRepo;
import com.BackItUp.orbital.repository.shareRepo;
import com.BackItUp.orbital.repository.userRepo;
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
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDate;
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


@WebMvcTest(PostController.class)
@Import(TestConfig.class) // Import the test configuration

class PostControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private userRepo userRepository;
    @MockBean
    private shareRepo shareRepository;
    @MockBean
    private notificationRepo notificationRepository;
    @MockBean
    private postRepo postRepository;


    Post PostOne;
    PostCreation PostCreationOne;
    Post PostTwo;
    PostCreation PostCreationTwo;
    private List<Post> PostLists = new ArrayList<>();

    @BeforeEach
    void setUp() {
        User CompanyOne= new User("CompanyA","companyA@gmail.com","8175422","password","linkedin.com",true);
        User CompanyTwo= new User("CompanyB","companyB@gmail.com","8175422","password","linkedin.com",true);

        PostCreation PostCreationOne = new PostCreation("Title1", "Description1","Content1","url.com",true,1,5000,10,0,10, LocalDateTime.now(),LocalDateTime.now(),LocalDateTime.now());
        PostCreation PostCreationTwo = new PostCreation("Title2", "Description2","Content2","url.com",true,2,5000,10,0,10, LocalDateTime.now(),LocalDateTime.now(),LocalDateTime.now());

        Share ShareOne = new Share(CompanyOne,PostCreationOne.getShareCountTotal(),PostCreationOne.getShareCountMin(),PostCreationOne.getShareCountCurrent(),PostCreationOne.getShareCountPrice());
        Share ShareTwo = new Share(CompanyTwo,PostCreationTwo.getShareCountTotal(),PostCreationTwo.getShareCountMin(),PostCreationTwo.getShareCountCurrent(),PostCreationTwo.getShareCountPrice());

        Post PostOne = new Post(CompanyOne, ShareOne,PostCreationOne);
        PostOne.setPostID(1);
        Post PostTwo = new Post(CompanyTwo, ShareTwo,PostCreationTwo);
        PostTwo.setPostID(2);

        PostLists.add(PostOne);
        PostLists.add(PostTwo);

        this.PostOne = PostOne;
        this.PostTwo = PostTwo;

        when(postRepository.findById(1)).thenReturn(Optional.ofNullable(this.PostOne));
        when(postRepository.findById(2)).thenReturn(Optional.ofNullable(this.PostTwo));
        when(postRepository.findAll()).thenReturn(this.PostLists);



    }

//    @Test
    void newPost() throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.WRAP_ROOT_VALUE,false);
        ObjectWriter ow = mapper.writer().withDefaultPrettyPrinter();
        String requestJSON = ow.writeValueAsString(PostCreationOne);

        this.mockMvc.perform(post("/api/createPost")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJSON))
                .andDo((print())).andExpect(status().isOk());

    }

//    @Test
    void editPost() throws Exception {
        PostEdit edit = new PostEdit("test","test","test","test",true,LocalDateTime.now());
        Post post = this.PostOne;

        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.WRAP_ROOT_VALUE,false);
        ObjectWriter ow = mapper.writer().withDefaultPrettyPrinter();
        String requestJSON = ow.writeValueAsString(edit);


        this.mockMvc.perform(post("/api/editPost/" + post.getPostID().toString())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJSON))
                .andDo((print())).andExpect(status().isOk());

    }

    @Test
    void submitPhoto() throws Exception {
        // Create a mock MultipartFile with some test content
        String fileContent = "Test file content";
        MockMultipartFile file = new MockMultipartFile("file", "test.txt",
                "text/plain", fileContent.getBytes());

        Post post = PostOne;


        // Call the submitEvidence method using mockMvc
        this.mockMvc.perform(MockMvcRequestBuilders.multipart("/api/post/submitPhoto/"+post.getPostID())
                        .file(file)
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(MockMvcResultMatchers.status().isOk());

    }

    @Test
    void findPost() throws Exception {
        Post post = this.PostOne;
        when(postRepository.findById(post.getPostID())).thenReturn(Optional.ofNullable(post));

        this.mockMvc.perform(get("/api/post/"+post.getPostID()))
                .andDo(print()).andExpect(status().isOk());

    }
    @Test
    void findAllPost() throws Exception {
        this.mockMvc.perform(get("/api/listPosts"))
                .andDo(print()).andExpect(status().isOk());
    }


    @Test
    void verifyPost() throws Exception {

        Post post = this.PostOne;
        when(postRepository.findById(post.getPostID())).thenReturn(Optional.ofNullable(post));

        this.mockMvc.perform(get("/api/post/verify/"+post.getPostID()+"/2023-06-25T10:00:00"))
                .andDo(print()).andExpect(status().isOk());

    }
    @Test
    void unverifyPost() throws Exception {
        Post post = this.PostOne;
        when(postRepository.findById(1)).thenReturn(Optional.ofNullable(post));

        this.mockMvc.perform(get("/api/post/unverify/"+post.getPostID()+"/2023-06-25T10:00:00"))
                .andDo(print()).andExpect(status().isOk());

    }

}