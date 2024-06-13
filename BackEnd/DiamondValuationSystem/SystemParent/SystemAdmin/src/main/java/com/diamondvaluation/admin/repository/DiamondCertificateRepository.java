package com.diamondvaluation.admin.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.diamond.DiamondCertificate;
@Repository
public interface DiamondCertificateRepository extends CrudRepository<DiamondCertificate, Integer>{
	
}
