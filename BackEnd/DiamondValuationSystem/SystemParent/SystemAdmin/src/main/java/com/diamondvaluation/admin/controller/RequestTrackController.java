package com.diamondvaluation.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.admin.exception.RequestNotFoundException;
import com.diamondvaluation.admin.exception.RequestTrackingNotFoundException;
import com.diamondvaluation.admin.service.RequestTrackService;
import com.diamondvaluation.common.RequestTrack;

@RestController
@RequestMapping("/request-track")
public class RequestTrackController {
	private final RequestTrackService service;

	public RequestTrackController(RequestTrackService service) {
		this.service = service;
	}
	@GetMapping("/{id}")
	public ResponseEntity<?> getAllTrackingByRequestId(@PathVariable("id") Integer id){
		try {
			List<RequestTrack> list = service.getTrackingByRequestId(id);
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
		} catch (RequestTrackingNotFoundException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
}
