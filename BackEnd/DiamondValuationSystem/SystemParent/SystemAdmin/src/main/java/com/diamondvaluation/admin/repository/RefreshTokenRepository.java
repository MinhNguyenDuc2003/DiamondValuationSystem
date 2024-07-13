package com.diamondvaluation.admin.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.diamondvaluation.common.RefreshToken;
@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer>{
	@Query("SELECT rt FROM RefreshToken rt WHERE rt.user.id = ?1 AND rt.userType='user'")
	public List<RefreshToken> findByUserId(Integer id);
	
	@Query("DELETE FROM RefreshToken rt WHERE rt.expiryTime <= CURRENT_TIME")
	@Modifying
	public int deleteByExpiryTime();
	
	@Modifying
    @Transactional
    @Query("DELETE FROM RefreshToken rt WHERE rt.user.id = ?1")
    void deleteAllByUserId(Integer id);
}
