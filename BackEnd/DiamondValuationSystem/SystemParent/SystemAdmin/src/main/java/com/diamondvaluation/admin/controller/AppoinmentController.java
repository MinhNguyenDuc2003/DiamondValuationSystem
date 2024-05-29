package com.diamondvaluation.admin.controller;

import java.util.Date;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.admin.exception.EmailIsAlreadyExistException;
import com.diamondvaluation.admin.request.AppoinmentRequest;
import com.diamondvaluation.admin.response.MessageResponse;
import com.diamondvaluation.admin.service.AppoinmentService;
import com.diamondvaluation.admin.service.CustomerService;
import com.diamondvaluation.admin.service.UserService;
import com.diamondvaluation.common.Appoinment;
import com.diamondvaluation.common.Customer;
import com.diamondvaluation.common.User;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/appoinments/")
public class AppoinmentController {
	private final AppoinmentService appoinmentService;
	private final UserService userService;
	private final CustomerService cusService;
	private final ModelMapper modelMapper;
	
	@Autowired
	public AppoinmentController(AppoinmentService appoinmentService, UserService userService,
			CustomerService cusService, ModelMapper modelMapper) {
		this.appoinmentService = appoinmentService;
		this.userService = userService;
		this.cusService = cusService;
		this.modelMapper=modelMapper;
	}
	
	@PostMapping("appoinment/save")
	public ResponseEntity<?> addNewAppoinment(@ModelAttribute @Valid AppoinmentRequest appoinmentRequest) {
		try {
			Appoinment appoinment = request2Entity(appoinmentRequest);
			appoinmentService.save(appoinment);
			return new ResponseEntity<>(new MessageResponse("Add/Update Appoinment successfully!"), HttpStatus.OK);
		} catch (EmailIsAlreadyExistException e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}
	
	private Appoinment request2Entity(AppoinmentRequest request) {
		Appoinment appoinment = modelMapper.map(request, Appoinment.class);
		Customer customer = new Customer(request.getCustomer_id());
		appoinment.setCustomer(customer);
		User user = new User(request.getUser_id());
		appoinment.setUser(user);
		Date date = new Date();
		appoinment.setCreatedTime(date);
		appoinment.setMeetingDate(request.getMeeting_date());
		appoinment.setMeetingTime(request.getMeeting_time());
		return appoinment;
	}
	
	
	
	
}
