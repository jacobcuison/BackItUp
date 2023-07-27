package com.BackItUp.orbital.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Post")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "POST_ID")
    private Integer postID;

    @ManyToOne
    @JoinColumn(name = "USER_ID")
    private User user;

    @Column(name = "POST_TITLE", columnDefinition = "TEXT")
    private String postTitle;

    @Column(name = "POST_DESCRIPTION", columnDefinition = "TEXT")
    private String postDescription;

    @Column(name = "POST_CONTENT", columnDefinition = "TEXT")
    private String postContent;

    @Column(name = "POST_URL", columnDefinition = "TEXT")
    private String postURL;

    @Column(name = "POST_SUSTAINABLE")
    private boolean postSustainable;

    @OneToOne
    @JoinColumn(name = "SHARE_ID")
    private Share share;

    @Column(name = "POST_STATUS")
    private Integer postStatus;

    @Column(name = "POST_CREATE_DT")
    private LocalDateTime postCreateDT;

    @Column(name = "POST_APPROVED_DT")
    private LocalDateTime postApprovedDT;

    @Column(name = "POST_RAISE_DT")
    private LocalDateTime postRaiseDT;

    @Column(name = "POST_EXPIRE_DT")
    private LocalDateTime postExpireDT;

    @Column(name = "POST_FINALISING_DT")
    private LocalDateTime postFinalisingDT;

    @Column(name = "POST_COMPLETED_DT")
    private LocalDateTime postCompletedDT;

    @Column(name = "POST_PHOTOURL", columnDefinition = "TEXT")
    private String postPhotoURL;


    // Getters and setters
    public Post(){}

    public Post(User user, Share share, PostCreation postCreationJSON) {
        this.user = user;
        this.share = share;

        this.postTitle = postCreationJSON.getPostTitle();
        this.postDescription = postCreationJSON.getPostDescription();
        this.postContent = postCreationJSON.getPostContent();
        this.postURL = postCreationJSON.getPostURL();
        this.postSustainable = postCreationJSON.isPostSustainable();
        this.postExpireDT = postCreationJSON.getPostExpireDT();

        this.postStatus = postCreationJSON.getPostStatus(); // should be 0 initially.
        this.postCreateDT = postCreationJSON.getPostCreateDT();
    }

    public void editPost(PostEdit response){

        this.postTitle = response.getPostTitle();
        this.postDescription = response.getPostDescription();
        this.postContent = response.getPostContent();
        this.postURL = response.getPostURL();
        this.postSustainable = response.isPostSustainable();
        this.postExpireDT = response.getPostExpireDT();
    }

    public Integer getPostID() {
        return postID;
    }

    public void setPostID(Integer postID) {
        this.postID = postID;
    }

    public String getPostPhotoURL() {
        return postPhotoURL;
    }

    public void setPostPhotoURL(String postPhotoURL) {
        this.postPhotoURL = postPhotoURL;
    }

    public User getUser() {
        return user;
    }

    public boolean isPostSustainable() {
        return postSustainable;
    }

    public void setPostSustainable(boolean postSustainable) {
        this.postSustainable = postSustainable;
    }

    public void setUser(User user) {
        this.user = user;
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

    public Share getShare() {
        return share;
    }

    public void setShare(Share share) {
        this.share = share;
    }

    public Integer getPostStatus() {
        return postStatus;
    }

    public void setPostStatus(Integer postStatus) {
        this.postStatus = postStatus;
    }

    public LocalDateTime getPostCreateDT() {
        return postCreateDT;
    }

    public void setPostCreateDT(LocalDateTime postCreateDT) {
        this.postCreateDT = postCreateDT;
    }

    public LocalDateTime getPostApprovedDT() {
        return postApprovedDT;
    }

    public void setPostApprovedDT(LocalDateTime postApprovedDT) {
        this.postApprovedDT = postApprovedDT;
    }

    public boolean isPendingStatus() {
        return postStatus == 0;
    }


    public boolean verify(LocalDateTime dt) {
        setPostApprovedDT(dt);
        setPostStatus(1);

        return true;
    }
    public boolean unverify(LocalDateTime dt) {
        setPostApprovedDT(dt);
        setPostStatus(-1);

        return true;
    }


    public LocalDateTime getPostRaiseDT() {
        return postRaiseDT;
    }

    public void setPostRaiseDT(LocalDateTime postRaiseDT) {
        this.postRaiseDT = postRaiseDT;
    }

    public LocalDateTime getPostExpireDT() {
        return postExpireDT;
    }

    public void setPostExpireDT(LocalDateTime postExpireDT) {
        this.postExpireDT = postExpireDT;
    }

    public LocalDateTime getPostFinalisingDT() {
        return postFinalisingDT;
    }

    public void setPostFinalisingDT(LocalDateTime postFinalisingDT) {
        this.postFinalisingDT = postFinalisingDT;
    }

    public LocalDateTime getPostCompletedDT() {
        return postCompletedDT;
    }

    public void setPostCompletedDT(LocalDateTime postCompletedDT) {
        this.postCompletedDT = postCompletedDT;
    }

}



