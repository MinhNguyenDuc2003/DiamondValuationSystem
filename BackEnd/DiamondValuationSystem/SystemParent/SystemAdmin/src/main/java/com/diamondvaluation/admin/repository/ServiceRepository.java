package com.diamondvaluation.admin.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.DiamondService;

@Repository
public interface ServiceRepository extends CrudRepository<DiamondService, Integer>, PagingAndSortingRepository<DiamondService, Integer>{

}
