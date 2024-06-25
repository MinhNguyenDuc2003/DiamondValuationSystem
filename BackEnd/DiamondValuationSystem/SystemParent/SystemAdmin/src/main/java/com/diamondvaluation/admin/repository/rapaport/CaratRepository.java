package com.diamondvaluation.admin.repository.rapaport;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.diamondvaluation.common.diamond_information.Carat;

public interface CaratRepository extends JpaRepository<Carat, Integer> {

	// find carat base on begin carat and end carat
	Optional<Carat> findByBeginCaratAndEndCarat(double beginCarat, double endCarat);
}
