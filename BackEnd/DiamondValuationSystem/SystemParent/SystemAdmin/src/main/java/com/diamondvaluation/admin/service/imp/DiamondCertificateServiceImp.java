package com.diamondvaluation.admin.service.imp;


import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.diamondvaluation.admin.exception.CertificateIsAlreadyExistException;
import com.diamondvaluation.admin.exception.CertificateNotFoundException;
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
	public DiamondCertificate save(DiamondCertificate certificate) {
		if(repo.findByRequest(certificate.getRequest()).isPresent()){
			throw new CertificateIsAlreadyExistException("certificate with this id already exist!");
		}
		boolean isUpdate = certificate.getCode()!=null && certificate.getCode().length()>0;
		if(!isUpdate) {
			boolean isDuplicated = true;
			while(isDuplicated) {
				UUID uniqueKey = UUID.randomUUID();
				String code = "SH"+uniqueKey.toString().substring(23);
				certificate.setCode(code);
				if(!repo.findByCode(code).isPresent()) {
					isDuplicated = false;
				}
			}
		}
		return repo.save(certificate);
	}


	@Override
	public DiamondCertificate getCertificateById(Integer id) {
		Optional<DiamondCertificate> certificate = repo.findById(id);
		if(!certificate.isPresent()) {
			throw new CertificateNotFoundException("Cannot find any certificate with id: "+id);
		}
		return certificate.get();
	}

	@Override
	public boolean deleteById(Integer id) {
		Optional<DiamondCertificate> certificate = repo.findById(id);
		if(!certificate.isPresent()) {
			throw new CertificateNotFoundException("Can not find any appoinment with id: " + id);
		}
		repo.deleteById(id);
		return true;
	}

	@Override
	public List<DiamondCertificate> findAllCertificate() {
		return  (List<DiamondCertificate>) repo.findAll();
	}
	
	public static void main(String[] args) {
	    UUID uniqueKey = UUID.randomUUID();
	    System.out.println (uniqueKey.toString().substring(23));
	  }

}
