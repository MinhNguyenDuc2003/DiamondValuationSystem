package com.diamondvaluation.admin.service.imp;


import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.diamondvaluation.admin.exception.CertificateIsAlreadyExistException;
import com.diamondvaluation.admin.exception.CertificateNotFoundException;
import com.diamondvaluation.admin.exception.DiamondRequestAlreadyExistCertificateException;
import com.diamondvaluation.admin.exception.RequestNotFoundException;
import com.diamondvaluation.admin.repository.DiamondCertificateRepository;
import com.diamondvaluation.admin.repository.DiamondRequestRepository;
import com.diamondvaluation.admin.service.DiamondCertificateService;
import com.diamondvaluation.admin.service.DiamondValuationService;
import com.diamondvaluation.common.DiamondRequest;
import com.diamondvaluation.common.DiamondValuation;
import com.diamondvaluation.common.diamond.DiamondCertificate;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class DiamondCertificateServiceImp implements DiamondCertificateService {
	private final DiamondCertificateRepository repo;
	private final DiamondRequestRepository requestRepo;
	private final DiamondValuationService valuationService;


	@Override
	public DiamondCertificate save(DiamondCertificate certificate) {

		boolean isUpdate = certificate.getId()!=null && certificate.getId()!=0;
		if(!isUpdate) {
			boolean isDuplicated = true;
			Optional<DiamondCertificate> request = repo.findByRequestId(certificate.getRequest().getId());
			if(request.isPresent()) {
				throw new DiamondRequestAlreadyExistCertificateException("Certificate is already exist with this id");
			}
			while(isDuplicated) {
				UUID uniqueKey = UUID.randomUUID();
				String code = "SH"+uniqueKey.toString().substring(23);
				certificate.setCode(code);
				if(!repo.findByCode(code).isPresent()) {
					isDuplicated = false;
				}
			}
		}else {
			Optional<DiamondCertificate> certificateInDb = repo.findById(certificate.getId());
			Optional<DiamondRequest> request = requestRepo.findById(certificate.getRequest().getId());
			if(!request.isPresent()) {
				throw new RequestNotFoundException("Cannot find request with id");
			}
			if(!certificateInDb.isPresent()) {
				throw new CertificateNotFoundException("Cannot found certificate with id" +certificate.getId());
			}else {
				if(certificateInDb.get().getRequest().getId() != certificate.getRequest().getId()) {
					if(repo.findByRequestId(certificate.getRequest().getId()).isPresent()){
						throw new CertificateIsAlreadyExistException("certificate with this id already exist!");
					}
				}
				certificate.setRequest(request.get());
				certificate.setCreatedDate(certificateInDb.get().getCreatedDate());
				valuationService.deletebyId(certificateInDb.get().getValuation().getId());
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

	@Override
	public Integer findByRequestId(Integer id) {
		Optional<DiamondCertificate> cer = repo.findByRequestId(id);
		if(!cer.isPresent()) {
			return null;
		}
		return cer.get().getId();
	}

}
