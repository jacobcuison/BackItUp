package com.BackItUp.orbital.model;

import java.time.LocalDateTime;

public class PostCreation {
    private String postTitle;
    private String postDescription;
    private String postContent;
    private String postURL;
    private int userID;

    private int shareCountTotal;
    private int shareCountMin;
    private int shareCountCurrent;
    private double shareCountPrice;

    private int postStatus;
    private LocalDateTime postCreateDT;
    private LocalDateTime postExpireDT;
    private LocalDateTime postRaiseDT;

    private boolean postSustainable;

    // Constructors, getters, and setters
    public PostCreation(String postTitle, String postDescription, String postContent, String postURL, boolean postSustainable, int userID, int shareCountTotal, int shareCountMin, int shareCountCurrent, double shareCountPrice, LocalDateTime postCreateDT, LocalDateTime postExpireDT, LocalDateTime postRaiseDT) {
        this.postTitle = postTitle;
        this.postDescription = postDescription;
        this.postContent = postContent;
        this.postURL = postURL;
        this.userID = userID;
        this.postSustainable = postSustainable;
        this.shareCountTotal = shareCountTotal;
        this.shareCountMin = shareCountMin;
        this.shareCountCurrent = shareCountCurrent;
        this.shareCountPrice = shareCountPrice;
        this.postStatus = postStatus;
        this.postCreateDT = postCreateDT;
        this.postExpireDT = postExpireDT;
        this.postRaiseDT = postRaiseDT;
    }


    public LocalDateTime getPostExpireDT() {
        return postExpireDT;
    }

    public boolean isPostSustainable() {
        return postSustainable;
    }

    public LocalDateTime getPostRaiseDT() {
        return postRaiseDT;
    }

    public void setPostRaiseDT(LocalDateTime postRaiseDT) {
        this.postRaiseDT = postRaiseDT;
    }

    public void setPostSustainable(boolean postSustainable) {
        this.postSustainable = postSustainable;
    }

    public void setPostExpireDT(LocalDateTime postExpireDT) {
        this.postExpireDT = postExpireDT;
    }

    public String getPostTitle() {
        return postTitle;
    }

    public void setPostTitle(String postTitle) {
        this.postTitle = postTitle;
    }

    public String getPostDescription() {
        return postDescription;
    }

    public void setPostDescription(String postDescription) {
        this.postDescription = postDescription;
    }

    public String getPostContent() {
        return postContent;
    }

    public void setPostContent(String postContent) {
        this.postContent = postContent;
    }

    public String getPostURL() {
        return postURL;
    }

    public void setPostURL(String postURL) {
        this.postURL = postURL;
    }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public int getShareCountTotal() {
        return shareCountTotal;
    }

    public void setShareCountTotal(int shareCountTotal) {
        this.shareCountTotal = shareCountTotal;
    }

    public int getShareCountMin() {
        return shareCountMin;
    }

    public void setShareCountMin(int shareCountMin) {
        this.shareCountMin = shareCountMin;
    }

    public int getShareCountCurrent() {
        return shareCountCurrent;
    }

    public void setShareCountCurrent(int shareCountCurrent) {
        this.shareCountCurrent = shareCountCurrent;
    }

    public double getShareCountPrice() {
        return shareCountPrice;
    }

    public void setShareCountPrice(double shareCountPrice) {
        this.shareCountPrice = shareCountPrice;
    }

    public int getPostStatus() {
        return postStatus;
    }

    public void setPostStatus(int postStatus) {
        this.postStatus = postStatus;
    }

    public LocalDateTime getPostCreateDT() {
        return postCreateDT;
    }

    public void setPostCreateDT(LocalDateTime postCreateDT) {
        this.postCreateDT = postCreateDT;
    }

    
}



