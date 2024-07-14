package com.diamondvaluation.admin.service;

import java.util.Map;

import org.springframework.data.domain.Page;

import com.diamondvaluation.common.Customer;

public interface CustomerService {

	Customer save(Customer customer);

	boolean deleteCustomerById(Integer id);

	Customer getCustomerById(Integer id);

	Page<Customer> listCustomersByPage(int pageNum, String keyword);

	//new
		 Map<String, Integer> countCustomersByMonthForYear(int year);


	


}
