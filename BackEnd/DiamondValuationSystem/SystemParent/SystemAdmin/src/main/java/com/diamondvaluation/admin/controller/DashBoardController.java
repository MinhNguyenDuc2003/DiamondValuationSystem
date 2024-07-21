package com.diamondvaluation.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.admin.request.DailyRevenueRequest;
import com.diamondvaluation.admin.service.DashBoardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class DashBoardController {
	private final DashBoardService service;
	
	@GetMapping("/dashboard")
	public ResponseEntity<?> getDashBoardByYear(@RequestParam(value = "year", required = true) int year){
		try {
			return ResponseEntity.ok(service.getDashBoardByYear(year));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().build();
		}
	}
	
	@GetMapping("/daily/dashboard")
	public ResponseEntity<?> getDashBoardByYear(@RequestBody DailyRevenueRequest request){
		try {
			return ResponseEntity.ok(service.getDailyResponse(request.getBeginDate(), request.getEndDate()));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().build();
		}
	}
}
