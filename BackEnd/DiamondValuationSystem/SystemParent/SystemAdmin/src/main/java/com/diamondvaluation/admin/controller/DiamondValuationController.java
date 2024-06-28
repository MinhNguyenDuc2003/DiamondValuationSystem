package com.diamondvaluation.admin.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.diamondvaluation.admin.request.DiamondPrice;

@RestController
@RequestMapping("/api/price")
public class DiamondValuationController {

	private static final Logger log = LoggerFactory.getLogger(DiamondValuationController.class);

	@Autowired
	private RestTemplate restTemplate;

	@GetMapping("/get")
	public ResponseEntity<DiamondPrice> getDiamondPrice() {
		log.info("Starting API request...");
		String apiUrl = "http://www.idexonline.com/DPService.asp?SID=4wp7go123jqtkdyd5f2e&cut=Round&carat=1.00&color=E&clarity=VS1&make=Excellent&cert=GIA";
		ResponseEntity<DiamondPrice> response = restTemplate.getForEntity(apiUrl, DiamondPrice.class);
		System.out.println(response.getBody().getAvg());
		log.info("API request completed.");
		return response;
	}
}
