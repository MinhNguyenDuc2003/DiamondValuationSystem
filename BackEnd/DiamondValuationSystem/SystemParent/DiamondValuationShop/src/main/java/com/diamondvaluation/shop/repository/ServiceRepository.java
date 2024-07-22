package com.diamondvaluation.shop.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.DiamondService;

@Repository
public interface ServiceRepository extends CrudRepository<DiamondService, Integer>{
	Optional<DiamondService> findByName(String name);
	@Query("SELECT s FROM DiamondService s WHERE s.status = true")
	List<DiamondService> findAllServiceAvailable();
}
