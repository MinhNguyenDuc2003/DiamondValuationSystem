package com.diamondvaluation.admin.service.imp;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.diamondvaluation.admin.exception.UsernameNotFoundException;
import com.diamondvaluation.admin.repository.UserRepository;
import com.diamondvaluation.admin.request.AuthRequest;
import com.diamondvaluation.admin.response.TokenResponse;
import com.diamondvaluation.admin.security.jwt.JwtUtils;
import com.diamondvaluation.admin.service.AuthService;
import com.diamondvaluation.admin.service.TokenService;
import com.diamondvaluation.common.User;

@Service
public class AuthServiceImp implements AuthService {
	private final UserRepository userRepository;
	private final TokenService jwtUtils;
	private final AuthenticationManager authenticationManager;

	private static final Logger logger = LoggerFactory.getLogger(AuthServiceImp.class);

	@Autowired
	public AuthServiceImp(UserRepository userRepository, TokenService jwtUtils,
			AuthenticationManager authenticationManager) {
		this.userRepository = userRepository;
		this.jwtUtils = jwtUtils;
		this.authenticationManager = authenticationManager;
	}

	@Override
	public TokenResponse login(AuthRequest authRequest) {
		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
			Optional<User> userOptional = userRepository.findByUsername(authRequest.getEmail());
			if (userOptional.isPresent()) {
				User user = userOptional.get();
				if (user.isEnabled()) {
					return jwtUtils.generateTokens(user);
				}
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return null;
	}

	@Override
	public Optional<User> findByUsername(String username) {
		Optional<User> user = userRepository.findByUsername(username);
		if (!user.isPresent()) {
			throw new UsernameNotFoundException("User is not exist!");
		}
		return user;
	}

}
