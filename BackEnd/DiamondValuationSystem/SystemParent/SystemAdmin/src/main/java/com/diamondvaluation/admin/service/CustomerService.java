package com.diamondvaluation.admin.service;


import java.util.Map;
import java.time.LocalDate;
import java.util.List;


import org.springframework.data.domain.Page;

import com.diamondvaluation.common.Customer;

public interface CustomerService {

	Customer save(Customer customer);

	boolean deleteCustomerById(Integer id);

	Customer getCustomerById(Integer id);

	Page<Customer> listCustomersByPage(int pageNum, String keyword);


	//new
	
	List<Object> countCustomersByMonthForYear(int year);

	List<Customer> listCustomerByKeyword(String keyword);
	
	//new

	List<Object> countCustomerAndRevenueByDay(LocalDate date);

	List<Object> countCustomerByMonthWeekForYear(int year);
	
	Map<Integer, Integer> countCustomerEachMonthByYear(int year);

	int totalCustomerByYear(int year);

}

	

