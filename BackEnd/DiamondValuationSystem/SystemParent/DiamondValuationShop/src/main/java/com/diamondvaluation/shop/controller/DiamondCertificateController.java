package com.diamondvaluation.shop.controller;

import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.common.DiamondValuation;
import com.diamondvaluation.common.diamond.DiamondCertificate;
import com.diamondvaluation.shop.AmazonS3Util;
import com.diamondvaluation.shop.exception.CertificateNotFoundException;
import com.diamondvaluation.shop.response.CertificateResponse;
import com.diamondvaluation.shop.service.CertificateService;
import com.diamondvaluation.shop.service.DiamondValuationService;

@RestController
@RequestMapping("/diamond-certificate")
public class DiamondCertificateController {
	private final CertificateService service;
	private final DiamondValuationService valuationService;
	private final ModelMapper modelMapper;

	public DiamondCertificateController(CertificateService service, DiamondValuationService valuationService,
			ModelMapper modelMapper) {
		this.service = service;
		this.valuationService = valuationService;
		this.modelMapper = modelMapper;
	}

	private CertificateResponse entity2Response(DiamondCertificate certificate) {
		CertificateResponse response = modelMapper.map(certificate, CertificateResponse.class);
		response.setRequestId(certificate.getRequest().getId());
		if (certificate.getValuation() != null) {
			DiamondValuation valuation = valuationService.getById(certificate.getValuation().getId());
			response.setMaxPrice(valuation.getMaxPrice());
			response.setMinPrice(valuation.getMinPrice());
			response.setRealPrice(valuation.getRealPrice());
			response.setRapPercent(valuation.getRapPercent());
			response.setRapPrice(valuation.getRapPrice());
			response.setValuationId(valuation.getId());
		}
		if(certificate.getPhoto()!=null) {
			response.setPhoto(AmazonS3Util.S3_BASE_URI+"/certificate-photos/"+certificate.getId()+"/"+certificate.getPhoto());
		}
		return response;
	}
	
	@GetMapping("certificate/{id}")
	private ResponseEntity<?> getCertificateById(@PathVariable("id") Integer id) {
		try {
			return ResponseEntity.ok(entity2Response(service.findById(id)));
		} catch (CertificateNotFoundException e) {
			return ResponseEntity.badRequest().build();
		}
	}
	
	@GetMapping("certificate/code/{code}")
	private ResponseEntity<?> getCertificateById(@PathVariable("code") String code) {
		try {
			return ResponseEntity.ok(entity2Response(service.findByCode(code)));
		} catch (CertificateNotFoundException e) {
			return ResponseEntity.badRequest().build();
		}
	}
}
