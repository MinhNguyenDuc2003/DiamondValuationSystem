package com.diamondvaluation.shop.controller;

import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.common.Customer;
import com.diamondvaluation.shop.exception.CustomerNotFoundException;
import com.diamondvaluation.shop.request.CustomerRequest;
import com.diamondvaluation.shop.response.CustomerResponse;
import com.diamondvaluation.shop.service.CustomerService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/diamond-shop/customer")
public class CustomerController {
	private final ModelMapper modelMapper;
	private final CustomerService cusService;

	public CustomerController(ModelMapper modelMapper, CustomerService cusService) {
		this.modelMapper = modelMapper;
		this.cusService = cusService;
	}
	
	private CustomerResponse entity2Response(Customer customer) {
		CustomerResponse customerResponse = modelMapper.map(customer, CustomerResponse.class);
		return customerResponse;
	}
	
	private Customer request2Entity(CustomerRequest customer) {
		Customer customerResponse = modelMapper.map(customer, Customer.class);
		return customerResponse;
	}
	
	@PostMapping("/information")
	public ResponseEntity<?> getCustomerInfomation(@RequestParam("id") String id){
		try {
			Customer customer = cusService.getCustomerById(Integer.parseInt(id));
			return ResponseEntity.ok(entity2Response(customer));
		} catch (CustomerNotFoundException e) {
			return ResponseEntity.badRequest().build();
		}
	}
	
	@PutMapping("/update")
	public ResponseEntity<?> updateCustomerInfomation(@RequestBody @Valid CustomerRequest customerRequest){
		try {
			Customer customer = cusService.updateCustomer(request2Entity(customerRequest));
			if(customer != null) {
				return ResponseEntity.ok().build();
			}
			return ResponseEntity.badRequest().build();
			
		} catch (CustomerNotFoundException e) {
			return ResponseEntity.badRequest().build();
		}
	}
	
}
