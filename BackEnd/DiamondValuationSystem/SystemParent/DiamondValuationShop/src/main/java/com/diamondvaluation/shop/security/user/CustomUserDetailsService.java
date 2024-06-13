package com.diamondvaluation.shop.security.user;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.diamondvaluation.common.Customer;
import com.diamondvaluation.shop.exception.CustomerNotFoundException;
import com.diamondvaluation.shop.repository.CustomerRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {
	@Autowired
	private CustomerRepository cusRepo;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Optional<Customer> findByUsername = cusRepo.findByEmail(username);

		if (!findByUsername.isPresent()) {
			throw new UsernameNotFoundException("No user found with the given user name");
		}

		return new CustomUserDetails(findByUsername.get());
	}
}
