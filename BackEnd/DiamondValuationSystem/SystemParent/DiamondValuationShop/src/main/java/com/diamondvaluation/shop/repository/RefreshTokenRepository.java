package com.diamondvaluation.shop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.RefreshToken;
@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer>{
	@Query("SELECT rt FROM RefreshToken rt WHERE rt.customer.id = ?1 AND rt.userType='customer'")
	public List<RefreshToken> findByCustomerId(Integer id);
}
