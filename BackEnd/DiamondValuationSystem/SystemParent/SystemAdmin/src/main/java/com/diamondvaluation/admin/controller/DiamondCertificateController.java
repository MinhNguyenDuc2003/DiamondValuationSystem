package com.diamondvaluation.admin.controller;


import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.admin.exception.CertificateNotFoundException;
import com.diamondvaluation.admin.exception.RequestNotFoundException;
import com.diamondvaluation.admin.request.CertificateRequest;
import com.diamondvaluation.admin.response.CertificateResponse;
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
	
	private CertificateResponse entity2Response(DiamondCertificate certificate) {
		CertificateResponse response = modelMapper.map(certificate, CertificateResponse.class);
		
		return response;
	}
	
	
	
	@GetMapping("certificate/{id}")
	private ResponseEntity<?> getCertificateById(@PathVariable("id") Integer id){
		try {
			return ResponseEntity.ok(entity2Response(service.getCertificateById(id)));
		} catch (CertificateNotFoundException e) {
			return ResponseEntity.ok(e.getMessage());
		}
	}
	
	@DeleteMapping("delete/{id}")
	public ResponseEntity<?> deleteRequestById(@PathVariable("id") Integer id) {
		try {
			service.deleteById(id);
			return new ResponseEntity<>(new MessageResponse("Delete Certificate successfully with id " + id),
					HttpStatus.OK);
		} catch (RequestNotFoundException e) {
			return ResponseEntity.status(HttpStatus.OK).body(e.getMessage());
		}
	}
	
	private List<CertificateResponse> listEntity2Response(List<DiamondCertificate> list) {
		List<CertificateResponse> response = (List<CertificateResponse>) list.stream()
				.map(s -> entity2Response(s)).toList();
		return response;
	}
	
	@GetMapping("all")
	public ResponseEntity<?> getAllCertificate() {
		List<DiamondCertificate> list = service.findAllCertificate();
		return new ResponseEntity(listEntity2Response(list), HttpStatus.OK);
	}
}
