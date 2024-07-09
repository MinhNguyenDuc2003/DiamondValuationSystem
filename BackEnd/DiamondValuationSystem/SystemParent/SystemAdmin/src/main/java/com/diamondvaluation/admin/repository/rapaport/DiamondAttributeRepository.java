package com.diamondvaluation.admin.repository.rapaport;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.diamondvaluation.common.diamond_information.DiamondAttribute;

public interface DiamondAttributeRepository extends JpaRepository<DiamondAttribute, Integer> {
	List<DiamondAttribute> findAllByCaratId(Integer caratId);
	
	@Query(value = "SELECT * FROM diamond_attributes a WHERE a.carat_id = :carat_id AND a.color= :color AND a.clarity= :clarity", nativeQuery = true)
	Optional<DiamondAttribute> findNumberBy4C(@Param("carat_id")Integer caratId,@Param("color") String color,@Param("clarity") String clarity);
}
