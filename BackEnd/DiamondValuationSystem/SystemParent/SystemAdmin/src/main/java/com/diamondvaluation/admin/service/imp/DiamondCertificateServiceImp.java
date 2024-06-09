package com.diamondvaluation.admin.service.imp;

import org.springframework.stereotype.Service;

import com.diamondvaluation.admin.repository.DiamondCertificateRepository;
import com.diamondvaluation.admin.service.DiamondCertificateService;
import com.diamondvaluation.common.diamond.DiamondCertificate;
@Service
public class DiamondCertificateServiceImp implements DiamondCertificateService {
	private final DiamondCertificateRepository repo;

	public DiamondCertificateServiceImp(DiamondCertificateRepository repo) {
		this.repo = repo;
	}

	@Override
	public void save(DiamondCertificate certificate) {
		repo.save(certificate);
	}
	
	

}
