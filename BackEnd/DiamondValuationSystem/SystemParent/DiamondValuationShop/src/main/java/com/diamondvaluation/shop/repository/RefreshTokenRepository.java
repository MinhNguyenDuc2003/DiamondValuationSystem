package com.diamondvaluation.shop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.diamondvaluation.common.RefreshToken;
@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer>{
	@Query("SELECT rt FROM RefreshToken rt WHERE rt.customer.id = ?1")
	public List<RefreshToken> findByCustomerId(Integer id);
	
	@Modifying
    @Transactional
    @Query("DELETE FROM RefreshToken rt WHERE rt.customer.id = ?1")
    void deleteAllByCustomerId(Integer id);
}
