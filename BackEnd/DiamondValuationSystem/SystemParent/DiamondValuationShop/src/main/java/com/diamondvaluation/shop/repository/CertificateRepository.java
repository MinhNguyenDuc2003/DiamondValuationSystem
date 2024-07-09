package com.diamondvaluation.shop.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.diamond.DiamondCertificate;
@Repository
public interface CertificateRepository extends CrudRepository<DiamondCertificate, Integer>{
	@Query(value = "SELECT * FROM diamond_certificates d WHERE d.request_id = :requestId", nativeQuery = true)
    Optional<DiamondCertificate> findByRequestId(@Param("requestId") Integer requestId);
	
	Optional<DiamondCertificate> findByCode(String code);
}
