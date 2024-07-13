package com.diamondvaluation.shop.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.common.DiamondService;
import com.diamondvaluation.shop.service.DiamondServiceService;

@RestController
@RequestMapping("/services")
public class CheckOutController {
	private final DiamondServiceService diamondService;

	public CheckOutController(DiamondServiceService diamondService) {
		this.diamondService = diamondService;
	}
	
	@GetMapping("/all")
	public ResponseEntity<?> getAllServices(){
		try {
			List<DiamondService> services = diamondService.getAllService();
			return ResponseEntity.ok(services);
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}
}
