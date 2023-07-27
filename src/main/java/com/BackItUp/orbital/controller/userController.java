package com.BackItUp.orbital.controller;

import com.BackItUp.orbital.model.Notification;
import com.BackItUp.orbital.model.User;
import com.BackItUp.orbital.model.UserEdit;
import com.BackItUp.orbital.repository.notificationRepo;
import com.BackItUp.orbital.repository.userRepo;

import com.BackItUp.orbital.model.Wallet;
import com.BackItUp.orbital.repository.walletRepo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("https://backitup.mysql.database.azure.com/")
public class userController {
    @Autowired
    private userRepo userRepository;
    @Autowired
    private walletRepo WALLETRepository;
    @Autowired
    private notificationRepo NOTIFICATIONRepository;

    //Creating User
    @PostMapping("/api/createUser")
    User newUser(@RequestBody User user) {

        //if got existed email refuse to sign them up
        if(findExistedEmail(user.getUserEmail())){
            return null;
        }

        Wallet newWallet = new Wallet(0,0);
        WALLETRepository.save(newWallet);

        user.setWallet(newWallet);

        System.out.println(user);

        return userRepository.save(user);
    }


    @PostMapping("/api/createUserbyAuth")
    User createUserbyAuth(@RequestBody User user) {
        if(findExistedEmail(user.getUserEmail())){
            return null;
        }

        Wallet newWallet = new Wallet(0,0);
        WALLETRepository.save(newWallet);

        user.setWallet(newWallet);

        System.out.println(user);

        return userRepository.save(user);
    }

    @PostMapping("/api/createCompany/{creatorId}")
    User newCompany(@RequestBody User user,@PathVariable("creatorId") Integer creatorId) {

        Wallet newWallet = new Wallet(0,0);
        WALLETRepository.save(newWallet);

        user.setCreator(userRepository.findById(creatorId).get());
        user.setWallet(newWallet);

        System.out.println(user);

        return userRepository.save(user);
    }

    //Editing User
    @PostMapping("/api/editUser/{id}")
    User editUser(@RequestBody UserEdit resp, @PathVariable("id") Integer creatorId) {

        User user = userRepository.findById(creatorId).get();

        user.editUser(resp);

        return userRepository.save(user);
    }

    @PostMapping("/api/user/submitEvidence/{userID}")
    String submitEvidence(@PathVariable("userID") Integer creatorId, @RequestParam("file") MultipartFile file) {
        try {
            // Configure the destination directory
            String uploadDir = "backitup-front/public/images/evidence";

            LocalDateTime datetime1 = LocalDateTime.now();
            DateTimeFormatter format = DateTimeFormatter.ofPattern("dd-MM-yyyy-HH-mm-ss");
            String formatDateTime = datetime1.format(format);

            String filename = formatDateTime + "-" +file.getOriginalFilename();
            Path filePath = Path.of(uploadDir, filename);

            // Save the file to the destination directory
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String dbURL = "/images/evidence/" + filename;
            User user = userRepository.findById(creatorId).get();
            user.setUserEvidence(dbURL);
            userRepository.save(user);

            // Handle success
            System.out.println("Evidence uploaded successfully");
            return user.getUserEvidence();
        } catch (Exception e) {
            // Handle error
            System.err.println("Error uploading evidence: " + e.getMessage());
            return "Fail";
        }

    }

    @PostMapping("/api/user/submitPhoto/{userID}")
    String submitPhoto(@PathVariable("userID") Integer userID, @RequestParam("file") MultipartFile file) {
        try {
            // Configure the destination directory
            String uploadDir = "backitup-front/public/images/user/";

            LocalDateTime datetime1 = LocalDateTime.now();
            DateTimeFormatter format = DateTimeFormatter.ofPattern("dd-MM-yyyy-HH-mm-ss");
            String formatDateTime = datetime1.format(format);

            String filename = formatDateTime + '-' + file.getOriginalFilename();
            Path filePath = Path.of(uploadDir, filename);

            // Save the file to the destination directory
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String dbURL = "/images/user/" + filename;

            User user = userRepository.findById(userID).get();
            user.setUserPhotoURL(dbURL);
            userRepository.save(user);

            // Handle success
            System.out.println("Image uploaded successfully");
            return user.getUserPhotoURL();
        } catch (Exception e) {
            // Handle error
            System.err.println("Error uploading image: " + e.getMessage());
            return "Fail";
        }

    }


    //Get Lists of Unverified Founders
    @GetMapping("/api/unverifiedFounder")
    List<User> getUnverifiedFounders() {
        return userRepository.findByUserTypeAndUserVerified("Founder", 0);
    }


    //Log-in Purpose
    @GetMapping("/api/verifyUser/{email}/{password}")
    public Integer verifyUser(@PathVariable("email") String userEmail,@PathVariable("password") String userPass) {
        // Retrieve the user record from the database
        Optional<User> optionalUser = userRepository.findByUserEmailAndUserPass(userEmail,userPass);


        if (optionalUser.isEmpty()) {
            return null;
        }
        User user = optionalUser.get();
        return user.getUserID();
    }
    //Log-in Purpose
    @GetMapping("/api/verifyCompany/{email}/{password}")
    public Integer verifyCompany(@PathVariable("email") String userEmail,@PathVariable("password") String userPass) {
        // Retrieve the user record from the database
        Optional<User> optionalUser = userRepository.findByUserEmailAndUserPass(userEmail,userPass);


        if (optionalUser.isEmpty()) {
            return null;
        }
        User user = optionalUser.get();


        if(user.getUserType().equals("Company") && user.getUserVerified() == 1){
            return user.getUserID();
        }else{
            return null;
        }
    }
    //Log-in Purpose
    @GetMapping("/api/verifyFounder/{email}/{password}")
    public Integer verifyFounder(@PathVariable("email") String userEmail,@PathVariable("password") String userPass) {
        // Retrieve the user record from the database
        Optional<User> optionalUser = userRepository.findByUserEmailAndUserPass(userEmail,userPass);


        if (optionalUser.isEmpty()) {
            return null;
        }
        User user = optionalUser.get();


        if(user.getUserType().equals("Founder") && user.getUserVerified() == 1){
            return user.getUserID();
        }else{
            return null;
        }
    }

    @GetMapping("/api/verifyUserbyAuth/{userOauthIdentifier}/{type}")
    public Integer verifyUserbyAuth(@PathVariable("type") String type,@PathVariable("userOauthIdentifier") String userOauthIdentifier) {
        // Retrieve the user record from the database
        Optional<User> optionalUser = userRepository.findByUserOauthIdentifierAndUserOauthType(userOauthIdentifier,type);
        //Type is basically FACEBOOK/GOOGLE/GITHUB

        if (optionalUser.isEmpty()) {
            return null;
        }
        User user = optionalUser.get();

        return user.getUserID();
    }


    // Retrieve the user record from the database
    @GetMapping("/api/user/{userID}")
    public User getUser(@PathVariable("userID") Integer userID) {
        Optional<User> optionalUser = userRepository.findById(userID);


        if (optionalUser.isEmpty()) {
            return null;
        }
        User user = optionalUser.get();

        return user;
    }

    //Verify User
    @GetMapping("/api/{id}/verify")
    public Boolean verifyUser(@PathVariable("id") Integer userId) {
        // Retrieve the user record from the database
        Optional<User> optionalUser = userRepository.findById(userId);


        if (optionalUser.isEmpty()) {
            return false;
        }

        User user = optionalUser.get();

        // Update the user_verified field
        user.setUserVerified(1);

        // Save the updated user record
        userRepository.save(user);

        Notification noti = Notification.sendVerifiedNotification(user);
        NOTIFICATIONRepository.save(noti);
        
        return true;
    }
    
    //Unverify User
    @GetMapping("/api/{id}/unverify")
    public Boolean unverifyUser(@PathVariable("id") Integer userId) {
        // Retrieve the user record from the database
        Optional<User> optionalUser = userRepository.findById(userId);


        if (optionalUser.isEmpty()) {
            return false;
        }

        User user = optionalUser.get();

        // Update the user_verified field
        user.setUserVerified(0);

        // Save the updated user record
        userRepository.save(user);

        return true;
    }



    @GetMapping("/api/users")
    List<User> getAllUsers() {
        return userRepository.findAll();
    }

    boolean findExistedEmail(String email){
        return (userRepository.findByUserEmail(email) != null);
    }

}
