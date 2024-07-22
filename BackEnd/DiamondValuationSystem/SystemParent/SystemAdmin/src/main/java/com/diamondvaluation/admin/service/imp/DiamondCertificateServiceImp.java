package com.diamondvaluation.admin.service.imp;


import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Month;
import java.time.Year;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
import com.diamondvaluation.common.User;
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
		return repo.findAllCertificates();
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


	@Override
	public List<DiamondCertificate> findAllCertificateByUser(User user) {
		return repo.findAllCertificateByValuationStaffId(user.getId());
	}


	@Override
	public List<Object> countCertificatesByMonthForYear(int year) {
		List<Object> monthlyStats = new ArrayList<>();
	    int yearlyTotalCount = 0;
	    
	    for (Month month : Month.values()) {
	        List<Object> monthStats = new ArrayList<>();
	        monthStats.add("Month " + month.getValue());

	        LocalDateTime startOfMonth = Year.of(year).atMonth(month).atDay(1).atStartOfDay();
	        LocalDateTime endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.toLocalDate().lengthOfMonth()).with(LocalTime.MAX);

	        int monthlyTotalCount = repo.countByCreatedDateBetween(startOfMonth, endOfMonth);
	       
	        List<Object> totalStats = new ArrayList<>();
	        totalStats.add("Number of Certificates: " + monthlyTotalCount);
	      
	        monthStats.add(totalStats);
	        monthlyStats.add(monthStats);

	        yearlyTotalCount += monthlyTotalCount;
	        
	    }

	    // Add total stats for the year
	    List<Object> yearlyTotalStats = new ArrayList<>();
	    yearlyTotalStats.add("Year Total");
	    yearlyTotalStats.add("Number of Certificates: " + yearlyTotalCount);
	    
	    monthlyStats.add(yearlyTotalStats);

	    return monthlyStats;
	}


	@Override
	public Map<Integer, Integer> countCertificateEachMonthByYear(int year) {
		Map<Integer, Integer> maps = new HashMap<>();
		for(int i=1 ; i<13 ; i++) {
			int total = repo.countCertificateByMonth(i, year);
			maps.put(i, total);
		}
		return maps;
	}

	@Override
	public int totalByYear(int year) {
		return repo.countCertificateByYear(year);
	}

}
