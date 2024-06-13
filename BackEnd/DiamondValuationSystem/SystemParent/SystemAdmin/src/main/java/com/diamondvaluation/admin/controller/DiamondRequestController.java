package com.diamondvaluation.admin.controller;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.admin.exception.RequestNotFoundException;
import com.diamondvaluation.admin.request.DiamondRequestRequest;
import com.diamondvaluation.admin.response.DiamondRequestResponse;
import com.diamondvaluation.admin.response.MessageResponse;
import com.diamondvaluation.admin.service.DiamondRequestService;
import com.diamondvaluation.common.Customer;
import com.diamondvaluation.common.DiamondRequest;
import com.diamondvaluation.common.DiamondService;
import com.diamondvaluation.common.RequestStatus;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/diamond-requests/")
public class DiamondRequestController {
	private final DiamondRequestService requestService;
	private final ModelMapper modelMapper;

	@Autowired
	public DiamondRequestController(DiamondRequestService requestService, ModelMapper modelMapper
			) {
		this.requestService = requestService;
		this.modelMapper = modelMapper;
	}

	@PostMapping("request/save")
	public ResponseEntity<?> addNewRequest(@ModelAttribute @Valid DiamondRequestRequest appoinmentRequest,
			HttpServletRequest request) {
		try {
			DiamondRequest appoinment = request2Entity(appoinmentRequest);
			requestService.save(appoinment, request);
			
			return new ResponseEntity<>(new MessageResponse("Add/Update Appoinment successfully!"), HttpStatus.OK);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}

	private DiamondRequest request2Entity(DiamondRequestRequest request) {
		DiamondRequest appoinment = modelMapper.map(request, DiamondRequest.class);
		Customer customer = new Customer(request.getCustomer_id());
		appoinment.setCustomer(customer);
		List<String> services = request.getService_ids();
		List<DiamondService> list = new ArrayList<>();
		for (String id : services) {
			DiamondService service = new DiamondService(Integer.parseInt(id));
			list.add(service);
		}
		
		RequestStatus status = RequestStatus.valueOf(request.getStatus());
		appoinment.setStatus(status);
		appoinment.setServices(list);
		return appoinment;
	}

	private DiamondRequestResponse entity2Response(DiamondRequest appoinment) {
		DiamondRequestResponse appoinmentResponse = modelMapper.map(appoinment, DiamondRequestResponse.class);
		Customer customer = appoinment.getCustomer();
		appoinmentResponse.setCustomerName(customer.getFullname());
		appoinmentResponse.setCustomerPhone(customer.getPhoneNumber());
		appoinmentResponse.setService_ids(appoinment.getServiceIds());
		appoinmentResponse.setService_names(appoinment.getServiceNames());
		appoinmentResponse.setCreatedDate(appoinment.getCreatedDate().toString());
		return appoinmentResponse;
	}

	private List<DiamondRequestResponse> listEntity2Response(List<DiamondRequest> list) {
		List<DiamondRequestResponse> response = (List<DiamondRequestResponse>) list.stream()
				.map(s -> entity2Response(s)).toList();
		return response;
	}

	@GetMapping("request/{id}")
	public ResponseEntity<?> getReqeustById(@PathVariable("id") Integer id) {
		try {
			return new ResponseEntity<DiamondRequestResponse>(entity2Response(requestService.getRequestById(id)),
					HttpStatus.OK);
		} catch (RequestNotFoundException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@DeleteMapping("delete/{id}")
	public ResponseEntity<?> deleteRequestById(@PathVariable("id") Integer id) {
		try {
			requestService.deleteById(id);
			return new ResponseEntity<>(new MessageResponse("Delete Request successfully with id " + id),
					HttpStatus.OK);
		} catch (RequestNotFoundException e) {
			return ResponseEntity.status(HttpStatus.OK).body(e.getMessage());
		}
	}

	@GetMapping("all-request")
	public ResponseEntity<?> getAllRequest() {
		List<DiamondRequest> list = requestService.findAllRequest();
		return new ResponseEntity(listEntity2Response(list), HttpStatus.OK);
	}
	
	

}
