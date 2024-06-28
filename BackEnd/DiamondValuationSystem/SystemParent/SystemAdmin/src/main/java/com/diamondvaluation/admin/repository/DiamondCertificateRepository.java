package com.diamondvaluation.admin.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.diamond.DiamondCertificate;
import java.util.List;
import com.diamondvaluation.common.DiamondRequest;


@Repository
public interface DiamondCertificateRepository extends CrudRepository<DiamondCertificate, Integer>{
	Optional<DiamondCertificate> findByCode(String code);
	Optional<DiamondCertificate> findByRequest(DiamondRequest request);
}
