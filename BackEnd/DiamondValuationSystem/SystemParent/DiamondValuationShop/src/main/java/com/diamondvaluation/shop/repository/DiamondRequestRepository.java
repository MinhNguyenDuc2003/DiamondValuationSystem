package com.diamondvaluation.shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.DiamondRequest;

@Repository
public interface DiamondRequestRepository extends JpaRepository<DiamondRequest, Integer>{
	
}
