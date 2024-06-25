package com.diamondvaluation.admin.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.DiamondValuation;

@Repository
public interface DiamondValuationRepository extends CrudRepository<DiamondValuation, Integer>{

}
