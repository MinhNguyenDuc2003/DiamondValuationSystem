package com.diamondvaluation.shop.service.ipl;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.diamondvaluation.common.AuthenticationType;
import com.diamondvaluation.common.Customer;
import com.diamondvaluation.shop.exception.CustomerNotFoundException;
import com.diamondvaluation.shop.repository.CustomerRepository;
import com.diamondvaluation.shop.request.CustomerRequest;
import com.diamondvaluation.shop.service.CustomerService;
@Service
@Transactional
public class CustomerServiceIpl implements CustomerService{
	private final CustomerRepository repo;
	
	

	public CustomerServiceIpl(CustomerRepository repo) {
		this.repo = repo;
	}

	@Override
	public Customer getCustomerById(int id) {
		Optional<Customer> customer = repo.findById(id);
		if(!customer.isPresent()) {
			throw new CustomerNotFoundException("Cannot find any customer with id");
		}
		return customer.get();
	}

	@Override
	public Customer addNewCustomerUponOAuthLogin(String name, String email,String location, AuthenticationType type) {
		Customer customer = new Customer(name, email,location, type);
		customer.setEnabled(true);
		return repo.save(customer);
	}

	@Override
	public void updateAuthenticationType(Customer customer, AuthenticationType type) {
		if (!customer.getAuthenticationType().equals(type)) {
			repo.updateAuthenticationType(customer.getId(), type);
		}
		
	}

	@Override
	public Customer getCustomerByEmail(String email) {
		Optional<Customer> customer = repo.findByEmailAll(email);
		if(!customer.isPresent()) {
			return null;
		}
		return customer.get();
	}

	@Override
	public Customer getCustomerById(Integer id) {
		Optional<Customer> customer = repo.findById(id);
		if(!customer.isPresent()) {
			throw new CustomerNotFoundException("Cannot find any User with id" + id);
		}
		return customer.get();
	}

	@Override
	public Customer updateCustomer(Customer customer) {
		Optional<Customer> customerEmail = repo.findByEmailAll(customer.getEmail());
		Optional<Customer> customerById = repo.findById(customer.getId());
		if(!customerById.isPresent()) {
			throw new CustomerNotFoundException("Cannot find any User with id" + customer.getId());
		}
		Customer savedCustomer = customerById.get();
		String email = customerById.get().getEmail();
		
		if(customerEmail.isPresent()) {
			if(customerEmail.get().getEmail().equals(email)) {
				savedCustomer.setId(customer.getId());
				savedCustomer.setEmail(customer.getEmail());
				savedCustomer.setFirstName(customer.getFirstName());
				savedCustomer.setLastName(customer.getLastName());
				savedCustomer.setPhoneNumber(customer.getPhoneNumber());
				savedCustomer.setLocation(customer.getLocation());
				return repo.save(savedCustomer);
			}
		}else {
			savedCustomer.setId(customer.getId());
			savedCustomer.setEmail(customer.getEmail());
			savedCustomer.setFirstName(customer.getFirstName());
			savedCustomer.setLastName(customer.getLastName());
			savedCustomer.setPhoneNumber(customer.getPhoneNumber());
			savedCustomer.setLocation(customer.getLocation());
			return repo.save(savedCustomer);
		}
		return null;
	}

}
