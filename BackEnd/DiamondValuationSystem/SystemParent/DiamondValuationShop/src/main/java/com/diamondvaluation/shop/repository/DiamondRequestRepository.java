package com.diamondvaluation.shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.DiamondRequest;

@Repository
public interface DiamondRequestRepository extends JpaRepository<DiamondRequest, Integer>{
	@Query("UPDATE DiamondRequest d SET d.isPaid = ?2 WHERE d.id = ?1")
	void updatePayStatus(Integer id ,boolean status);
}
