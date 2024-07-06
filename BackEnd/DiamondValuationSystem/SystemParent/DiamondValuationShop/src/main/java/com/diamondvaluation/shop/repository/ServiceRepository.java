package com.diamondvaluation.shop.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.DiamondService;

@Repository
public interface ServiceRepository extends CrudRepository<DiamondService, Integer>{
	Optional<DiamondService> findByName(String name);
}
