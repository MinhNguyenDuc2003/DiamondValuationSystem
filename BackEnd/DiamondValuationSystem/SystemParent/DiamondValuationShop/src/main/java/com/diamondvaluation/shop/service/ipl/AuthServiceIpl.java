package com.diamondvaluation.shop.service.ipl;

import java.util.Optional;

import org.modelmapper.internal.bytebuddy.utility.RandomString;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.diamondvaluation.common.AuthenticationType;
import com.diamondvaluation.common.Customer;
import com.diamondvaluation.shop.exception.CustomerIsAlreadyExistException;
import com.diamondvaluation.shop.exception.CustomerNotFoundException;
import com.diamondvaluation.shop.repository.CustomerRepository;
import com.diamondvaluation.shop.request.AuthRequest;
import com.diamondvaluation.shop.response.AuthResponse;
import com.diamondvaluation.shop.response.TokenResponse;
import com.diamondvaluation.shop.service.AuthService;
import com.diamondvaluation.shop.service.TokenService;

@Service
@Transactional
public class AuthServiceIpl implements AuthService {
	private final CustomerRepository cusRepository;
	private final TokenService tokenService;
	private final AuthenticationManager authenticationManager;
	private final PasswordEncoder passwordEncoder;

	private static final Logger logger = LoggerFactory.getLogger(AuthServiceIpl.class);

	@Autowired
	public AuthServiceIpl(CustomerRepository cusRepository, TokenService tokenService,
			AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder) {
		this.cusRepository = cusRepository;
		this.tokenService = tokenService;
		this.authenticationManager = authenticationManager;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public AuthResponse login(AuthRequest authRequest) {
		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
			Optional<Customer> userOptional = cusRepository.findByEmail(authRequest.getEmail());
			if (userOptional.isPresent()) {
				Customer user = userOptional.get();
				if (user.isEnabled()) {
					TokenResponse token = tokenService.generateTokens(user);
					return new AuthResponse(user.getId()+"", user.getEmail(),token.getToken(), token.getRefreshToken());
				}
			} else {
				throw new CustomerNotFoundException("Can not find any User with email: " +authRequest.getEmail());
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return null;
	}
	
	public boolean isEmailUnique(String email) {
		Optional<Customer> customer = cusRepository.findByEmailAll(email);
		return customer.isPresent();
	}
	
	private void encodePassword(Customer customer) {
		String encodedPassword = passwordEncoder.encode(customer.getPassword());
		customer.setPassword(encodedPassword);
	}

	@Override
	public Customer signup(Customer customer) {
		if(isEmailUnique(customer.getEmail())) {
			throw new CustomerIsAlreadyExistException("Email is already exist!");
		}
		encodePassword(customer);
		customer.setAuthenticationType(AuthenticationType.DATABASE);	
		String randomCode = RandomString.make(64);
		customer.setVerificationCode(randomCode);
		return cusRepository.save(customer);
	}

	@Override
	public boolean verify(String code) {
		Optional<Customer> customer = cusRepository.findByVerificationCode(code);
		if(customer.isPresent() && !customer.get().isEnabled()) {
			cusRepository.enable(customer.get().getId());
			return true;
		}else {
			return false;
		}
	}
	
	

}
