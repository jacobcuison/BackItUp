package com.BackItUp.orbital.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

public class TopupResponse {
    private Integer walletID;
    private double topupAmount;
    private Integer topupPaynow;
    private byte[] topupEvidence;
    private Integer topupVerified;
    private LocalDateTime topupDT;

    public TopupResponse() {
    }

    public TopupResponse(Integer walletID, double topupAmount, Integer topupPaynow, LocalDateTime topupDT, Integer topupVerified) {
        this.walletID = walletID;
        this.topupAmount = topupAmount;
        this.topupPaynow = topupPaynow;
        this.topupVerified = topupVerified;
        this.topupDT = topupDT;
    }

    public Integer getWalletID() {
        return walletID;
    }

    public double getTopupAmount() {
        return topupAmount;
    }

    public Integer getTopupPaynow() {
        return topupPaynow;
    }

    public byte[] getTopupEvidence() {
        return topupEvidence;
    }

    public Integer getTopupVerified() {
        return topupVerified;
    }

    public Integer isTopupVerified() {
        return topupVerified;
    }

    public LocalDateTime getTopupDT() {
        return topupDT;
    }

    public void setWalletID(Integer walletID) {
        this.walletID = walletID;
    }

    public void setTopupAmount(double topupAmount) {
        this.topupAmount = topupAmount;
    }

    public void setTopupPaynow(Integer topupPaynow) {
        this.topupPaynow = topupPaynow;
    }

    public void setTopupEvidence(byte[] topupEvidence) {
        this.topupEvidence = topupEvidence;
    }

    public void setTopupVerified(Integer topupVerified) {
        this.topupVerified = topupVerified;
    }

    public void setTopupDT(LocalDateTime topupDT) {
        this.topupDT = topupDT;
    }
}
