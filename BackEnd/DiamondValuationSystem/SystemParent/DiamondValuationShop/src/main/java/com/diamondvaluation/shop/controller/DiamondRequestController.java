package com.diamondvaluation.shop.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.common.DiamondRequest;
import com.diamondvaluation.shop.Utility;
import com.diamondvaluation.shop.exception.CustomerNotFoundException;
import com.diamondvaluation.shop.service.DiamondRequestService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/diamond-request")
public class DiamondRequestController {
	private final DiamondRequestService service;

	public DiamondRequestController(DiamondRequestService service) {
		super();
		this.service = service;
	}
	
	@GetMapping("/all")
	public ResponseEntity<?> getAllRequests(HttpServletRequest request){
		try {
			String email = Utility.getEmailOfAuthenticatedCustomer(request);
			List<DiamondRequest> list = service.getAllRequestByCustomerEmail(email);
			return ResponseEntity.ok(list);
		} catch (CustomerNotFoundException e) {
			return ResponseEntity.badRequest().build();
		}
	}
}
