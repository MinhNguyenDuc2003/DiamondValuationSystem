package com.diamondvaluation.admin.controller;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.admin.exception.EmailIsAlreadyExistException;
import com.diamondvaluation.admin.exception.UsernameNotFoundException;
import com.diamondvaluation.admin.request.CustomerRequest;
import com.diamondvaluation.admin.response.CustomerPageResponse;
import com.diamondvaluation.admin.response.CustomerResponse;
import com.diamondvaluation.admin.response.MessageResponse;
import com.diamondvaluation.admin.service.CustomerService;
import com.diamondvaluation.common.Customer;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/customers/")
public class CustomerController {
	private final CustomerService customerService;
	private final ModelMapper modelMapper;

	@Autowired
	public CustomerController(CustomerService customerService, ModelMapper modelMapper) {
		this.customerService = customerService;
		this.modelMapper = modelMapper;
	}

	@PostMapping("customer/save")
	public ResponseEntity<?> addNewUser(@ModelAttribute @Valid CustomerRequest customerRequest) {
		try {
			Customer customer = request2Entity(customerRequest);
			customerService.save(customer);
			return new ResponseEntity<>(new MessageResponse("Add/Update User successfully!"), HttpStatus.OK);
		} catch (EmailIsAlreadyExistException e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}

	private Customer request2Entity(CustomerRequest request) {
		Customer customer = modelMapper.map(request, Customer.class);
		customer.setFirstName(request.getFirst_name());
		customer.setLastName(request.getLast_name());
		customer.setPhoneNumber(request.getPhone_number());
		return customer;
	}
	
	private CustomerResponse entity2Response(Customer customer) {
		CustomerResponse customerResponse = modelMapper.map(customer, CustomerResponse.class);
		return customerResponse;
	}
	
	@DeleteMapping("delete/{id}")
	public ResponseEntity<?> delete(@PathVariable("id") Integer id) {
		try {
			boolean isDeleted = customerService.deleteCustomerById(id);
			if (isDeleted == true) {
				return ResponseEntity.ok(new MessageResponse("customer id " + id + " is deleted successfully!"));
			}
			return ResponseEntity.badRequest().build();
		} catch (UsernameNotFoundException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
		
	}
	
	@GetMapping("customer/{id}")
	public ResponseEntity<?> getUserById(@PathVariable("id") Integer id) {
		try {
			return new ResponseEntity<CustomerResponse>(entity2Response(customerService.getCustomerById(id)), HttpStatus.OK);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
		
	}
	
	@GetMapping("page/{pageNum}")
	public ResponseEntity<CustomerPageResponse> findUserByPage(@PathVariable("pageNum")  int pageNum,
		@RequestParam(value = "keyword", required=false) String keyword){
		Page<Customer> listCustomers = customerService.listCustomersByPage(pageNum, keyword);
		int totalPage = listCustomers.getTotalPages();
		List<CustomerResponse> list = listEntity2ListResposne(listCustomers.get().toList());
		CustomerPageResponse response = new CustomerPageResponse(list, totalPage);
		return new ResponseEntity<CustomerPageResponse>(response, HttpStatus.OK);
	}
	
	private List<CustomerResponse> listEntity2ListResposne(List<Customer> customers){
		List<CustomerResponse> customerResponses = new ArrayList<>();
		customers.forEach(customer -> customerResponses.add(entity2Response(customer)));
		return customerResponses;
	}
}
