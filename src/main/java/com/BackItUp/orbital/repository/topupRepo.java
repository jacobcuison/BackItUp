package com.BackItUp.orbital.repository;


import com.BackItUp.orbital.model.Topup;
import com.BackItUp.orbital.model.Withdrawal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface topupRepo extends JpaRepository<Topup, Integer> {

}
