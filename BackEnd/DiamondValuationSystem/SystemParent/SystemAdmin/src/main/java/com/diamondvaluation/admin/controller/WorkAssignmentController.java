package com.diamondvaluation.admin.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.admin.request.AssignmentRequest;
import com.diamondvaluation.admin.request.ValuationStaffAssignmentRequest;
import com.diamondvaluation.admin.response.AssignmentResponse;
import com.diamondvaluation.admin.response.ValuationStaffAssignmentResponse;
import com.diamondvaluation.admin.service.WorkAssignmentService;
import com.diamondvaluation.common.User;
import com.diamondvaluation.common.WorkAssignment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/assignment")
public class WorkAssignmentController {
	private final WorkAssignmentService service;
	private final ModelMapper modelMapper;
	
	private WorkAssignment request2Entity(AssignmentRequest request) {
		WorkAssignment workAssignment = modelMapper.map(request, WorkAssignment.class);
		if (request.getDate() != null && request.getDate().toString().length() > 0) {
			DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
			LocalDate date = LocalDate.parse(request.getDate(), dateFormatter);
			workAssignment.setDate(date);
		}
		User user = new User(request.getUserId());
		workAssignment.setUser(user);
		return workAssignment;
	}
	
	@PostMapping("/save")
	public ResponseEntity<?> saveAssignment(@RequestBody @Valid AssignmentRequest assgimentRequest){
		try {
			service.save(request2Entity(assgimentRequest));
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@GetMapping("/all/date")
	public ResponseEntity<?> getAllByDate(@RequestParam String date){
		try {
			DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
			LocalDate localDate = LocalDate.parse(date, dateFormatter);
			List<AssignmentResponse> list = service.getAllByDate(localDate);
			return ResponseEntity.ok(list);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().build();
		}
	}
	
	@PutMapping("/status/{id}")
	public ResponseEntity<?> updateStatus(@RequestParam boolean status, @PathVariable("id") Integer id){
		try {
			service.updateStatus(id, status);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<?> deleteAssignment(@PathVariable("id") Integer id){
		try {
			service.deleteById(id);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@GetMapping("/valuation-staff-available")
	public ResponseEntity<?> getAllStaffValuationAvailable(@RequestParam String date){
		try {
			DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
			LocalDate localDate = LocalDate.parse(date, dateFormatter);
			List<ValuationStaffAssignmentResponse> response = service.getAllValuationStaffAvailable(localDate);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@PostMapping("/set-staff")
	public ResponseEntity<?> setStaffToRequest(@RequestBody @Valid ValuationStaffAssignmentRequest request){
		try {
			service.setStaffToRequest(request);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@DeleteMapping("/remove-request")
	public ResponseEntity<?> removeRequestFrom(@RequestBody @Valid ValuationStaffAssignmentRequest request){
		try {
			service.deleteRequestAndStaff(request);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
}
