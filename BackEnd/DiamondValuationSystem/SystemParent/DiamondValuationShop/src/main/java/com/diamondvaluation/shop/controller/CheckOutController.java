package com.diamondvaluation.shop.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.common.DiamondService;
import com.diamondvaluation.shop.AmazonS3Util;
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
			List<DiamondService> updatedServices = services.stream()
				    .map(o -> {
				    	if(o.getPhoto()!=null) {
				    		o.setPhoto(AmazonS3Util.S3_BASE_URI + "/service-photos/" + o.getId() + "/" + o.getPhoto());
					        return o;
				    	}else {
				    		return o;
				    	}
				    })
				    .collect(Collectors.toList());
			return ResponseEntity.ok(updatedServices);
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}
}
