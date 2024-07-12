package com.diamondvaluation.admin.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.diamondvaluation.common.Customer;

public interface CustomerService {

	Customer save(Customer customer);

	boolean deleteCustomerById(Integer id);

	Customer getCustomerById(Integer id);

	Page<Customer> listCustomersByPage(int pageNum, String keyword);

	List<Customer> listCustomerByKeyword(String keyword);

	

	


}
