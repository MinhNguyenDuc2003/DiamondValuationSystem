package com.diamondvaluation.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.admin.exception.ReportTrackingNotFoundException;
import com.diamondvaluation.admin.exception.RequestNotFoundException;
import com.diamondvaluation.admin.service.ReportTrackingService;
import com.diamondvaluation.common.ReportTracking;

@RestController
@RequestMapping("/report-track")
public class ReportTrackingController {
	private final ReportTrackingService service;

	public ReportTrackingController(ReportTrackingService service) {
		this.service = service;
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> getAllTrackingByReportId(@PathVariable("id") Integer id){
		try {
			List<ReportTracking> list = service.getTrackingByReportId(id);
			return ResponseEntity.ok(list);
		} catch (RequestNotFoundException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteTrackRequestById(@PathVariable("id") Integer id){
		try {
			service.deleteById(id);
			return ResponseEntity.ok().build();
		} catch (ReportTrackingNotFoundException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
}
