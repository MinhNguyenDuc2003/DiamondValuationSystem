package com.diamondvaluation.shop.service.ipl;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.diamondvaluation.common.diamond.DiamondCertificate;
import com.diamondvaluation.shop.exception.CertificateNotFoundException;
import com.diamondvaluation.shop.repository.CertificateRepository;
import com.diamondvaluation.shop.service.CertificateService;

@Service
public class CertificateServiceIpl implements CertificateService {
	private final CertificateRepository repo;

	public CertificateServiceIpl(CertificateRepository repo) {
		this.repo = repo;
	}

	@Override
	public Integer findByRequestId(Integer id) {
		Optional<DiamondCertificate> cer = repo.findByRequestId(id);
		if (!cer.isPresent()) {
			return null;
		}
		return cer.get().getId();
	}

	@Override
	public DiamondCertificate findByCode(String code) {
		Optional<DiamondCertificate> cer = repo.findByCode(code);
		if (!cer.isPresent()) {
			throw new CertificateNotFoundException("Cannot find any certificate with code:" + code);
		}
		return cer.get();
	}

	@Override
	public DiamondCertificate findById(Integer id) {
		Optional<DiamondCertificate> cer = repo.findById(id);
		if (!cer.isPresent()) {
			throw new CertificateNotFoundException("Cannot find any certificate with id:" + id);
		}
		return cer.get();
	}

}
