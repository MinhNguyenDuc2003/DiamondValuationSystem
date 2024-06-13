package com.diamondvaluation.admin.service.imp;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.diamondvaluation.admin.exception.EmailIsAlreadyExistException;
import com.diamondvaluation.admin.exception.UsernameNotFoundException;
import com.diamondvaluation.admin.repository.CustomerRepository;
import com.diamondvaluation.admin.service.CustomerService;
import com.diamondvaluation.common.Customer;
@Service
public class CustomerServiceImp implements CustomerService{
	public static final int CUSTOMERS_PER_PAGE = 7;
	private final CustomerRepository customerRepo;
	private final PasswordEncoder passwordEncoder;
	
	public CustomerServiceImp(CustomerRepository customerRepo, PasswordEncoder passwordEncoder) {
		this.customerRepo = customerRepo;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public Customer save(Customer customer) {
		boolean isUpdatingCustomer =
				(customer.getId() != null && (customer.getId()+"").trim().length()>0);
		
		if (isUpdatingCustomer) {
			Customer existingUser = customerRepo.findById(customer.getId()).get();

			if (customer.getPassword().isEmpty()) {
				customer.setPassword(existingUser.getPassword());
			} else {
				encodePassword(customer);
			}

		} else {
			if(isEmailExist(customer.getEmail())) {
				throw new EmailIsAlreadyExistException("Email is already exist!");
			}
			encodePassword(customer);
		}
		return customerRepo.save(customer);
		
	}
	
	private boolean isEmailExist(String email) {
		Optional<Customer> cusInDb = customerRepo.findByEmail(email);
		return cusInDb.isPresent();
	}
	
	private void encodePassword(Customer customer) {
		String encodedPassword = passwordEncoder.encode(customer.getPassword());
		customer.setPassword(encodedPassword);
	}

	@Override
	public boolean deleteCustomerById(Integer id) {
		Optional<Customer> customer = customerRepo.findById(id);
		if(!customer.isPresent()) {
			throw new UsernameNotFoundException("Can not find any user with Id "+id);
		}
		customerRepo.deleteById(id);
		return true;
	}

	@Override
	public Customer getCustomerById(Integer id) {
		Optional<Customer> customer = customerRepo.findById(id);
		if(!customer.isPresent()) {
			throw new UsernameNotFoundException("Can not find any user with Id "+id);
		}
		return customer.get();				
	}

	@Override
	public Page<Customer> listCustomersByPage(int pageNum, String keyword) {
		Pageable pageable = PageRequest.of(pageNum-1, CUSTOMERS_PER_PAGE);
		Page<Customer> customers = null;
		if(keyword!=null && keyword.trim().length()>0) {
			customers = customerRepo.findAll(keyword, pageable);
			return customers;
		}
		customers = customerRepo.findAll(pageable);
		return customers;
	}
	
}
