package com.diamondvaluation.shop.service;

import com.diamondvaluation.common.AuthenticationType;
import com.diamondvaluation.common.Customer;

public interface CustomerService {
	Customer getCustomerById(int id);
	Customer addNewCustomerUponOAuthLogin(String name, String email, String location, AuthenticationType type);
	void updateAuthenticationType(Customer customer, AuthenticationType type);
	Customer getCustomerByEmail(String email);
	Customer getCustomerById(Integer id);
	Customer updateCustomer(Customer customer);
}
