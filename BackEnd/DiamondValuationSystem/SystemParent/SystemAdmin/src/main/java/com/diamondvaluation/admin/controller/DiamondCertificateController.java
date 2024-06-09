package com.diamondvaluation.admin.controller;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.admin.request.CertificateRequest;
import com.diamondvaluation.admin.response.MessageResponse;
import com.diamondvaluation.admin.service.DiamondCertificateService;
import com.diamondvaluation.common.DiamondRequest;
import com.diamondvaluation.common.diamond.DiamondCertificate;
import com.diamondvaluation.common.diamond.DiamondClarity;
import com.diamondvaluation.common.diamond.DiamondColor;
import com.diamondvaluation.common.diamond.DiamondFluorescence;
import com.diamondvaluation.common.diamond.DiamondMake;
import com.diamondvaluation.common.diamond.DiamondPolish;
import com.diamondvaluation.common.diamond.DiamondSymmetry;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/certificates/")
public class DiamondCertificateController {
	private final DiamondCertificateService service;
	private final ModelMapper modelMapper;
	
	public DiamondCertificateController(DiamondCertificateService service, ModelMapper modelMapper) {
		this.service = service;
		this.modelMapper = modelMapper;
	}
	
	@PostMapping("certificate/save")
	public ResponseEntity<?> addNewCertificate(@ModelAttribute @Valid CertificateRequest request) {
		try {
			DiamondCertificate certificate = request2Entity(request);
			service.save(certificate);
			return new ResponseEntity<>(new MessageResponse("Add/Update Certificate successfully!"), HttpStatus.OK);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}
	
	private DiamondCertificate request2Entity(CertificateRequest request) {
		DiamondCertificate certificate = modelMapper.map(request, DiamondCertificate.class);
		DiamondColor color = DiamondColor.valueOf(request.getColor());
		DiamondClarity clarity = DiamondClarity.valueOf(request.getClarity());
		DiamondMake make = DiamondMake.valueOf(request.getMake());
		DiamondPolish polish = DiamondPolish.valueOf(request.getPolish());
		DiamondSymmetry symmetry = DiamondSymmetry.valueOf(request.getSymmetry());
		DiamondFluorescence flourescence = DiamondFluorescence.valueOf(request.getFlourescence());
		certificate.setColor(color);
		certificate.setClarity(clarity);
		certificate.setMake(make);
		certificate.setPolish(polish);
		certificate.setSymmetry(symmetry);
		certificate.setFlourescence(flourescence);
		DiamondRequest diamondRequest = new DiamondRequest(request.getRequest_id());
		certificate.setRequest(diamondRequest);
		return certificate;
	}
	
	
}
