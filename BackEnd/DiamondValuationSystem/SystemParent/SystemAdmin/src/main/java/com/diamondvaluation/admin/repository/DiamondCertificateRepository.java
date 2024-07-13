package com.diamondvaluation.admin.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.diamond.DiamondCertificate;


@Repository
public interface DiamondCertificateRepository extends CrudRepository<DiamondCertificate, Integer>{
	Optional<DiamondCertificate> findByCode(String code);
	
	@Query(value = "SELECT * FROM diamond_certificates d WHERE d.request_id = :requestId", nativeQuery = true)
    Optional<DiamondCertificate> findByRequestId(@Param("requestId") Integer requestId);
}
