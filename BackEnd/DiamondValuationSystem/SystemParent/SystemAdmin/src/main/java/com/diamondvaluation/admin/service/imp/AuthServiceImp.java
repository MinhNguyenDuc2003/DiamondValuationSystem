package com.diamondvaluation.admin.service.imp;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.diamondvaluation.admin.exception.PasswordNotRightException;
import com.diamondvaluation.admin.exception.UsernameNotFoundException;
import com.diamondvaluation.admin.repository.UserRepository;
import com.diamondvaluation.admin.request.AuthRequest;
import com.diamondvaluation.admin.response.TokenResponse;
import com.diamondvaluation.admin.service.AuthService;
import com.diamondvaluation.admin.service.TokenService;
import com.diamondvaluation.common.User;

@Service
public class AuthServiceImp implements AuthService {
	@Autowired
	private final UserRepository userRepository;
	private final TokenService jwtUtils;
	private final PasswordEncoder encoder;

	private static final Logger logger = LoggerFactory.getLogger(AuthServiceImp.class);

	@Autowired
	public AuthServiceImp(UserRepository userRepository, TokenService jwtUtils, PasswordEncoder encoder) {
		this.userRepository = userRepository;
		this.jwtUtils = jwtUtils;
		this.encoder = encoder;
	}

	@Override
	public TokenResponse login(AuthRequest authRequest) {
		User user = findByUsername(authRequest.getEmail());
		if (checkPaswordByUser(user, authRequest.getPassword()) && user.isEnabled()) {
			return jwtUtils.generateTokens(user);
		}
		return null;
	}

	@Override
	public User findByUsername(String username) {
		Optional<User> user = userRepository.findByUsername(username);
		if (!user.isPresent()) {
			throw new UsernameNotFoundException("User is not exist!");
		}
		return user.get();
	}

	@Override
	public boolean checkPaswordByUser(User user, String rawPassword) {
		if (!encoder.matches(rawPassword, user.getPassword())) {
			throw new PasswordNotRightException("Password is not right!");
		}
		return true;
	}

}
