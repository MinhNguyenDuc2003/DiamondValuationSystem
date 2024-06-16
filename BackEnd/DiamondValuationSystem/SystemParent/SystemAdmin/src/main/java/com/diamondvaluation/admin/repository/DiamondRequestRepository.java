package com.diamondvaluation.admin.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.DiamondRequest;
@Repository
public interface DiamondRequestRepository extends CrudRepository<DiamondRequest, Integer>, PagingAndSortingRepository<DiamondRequest, Integer>{
	
}
