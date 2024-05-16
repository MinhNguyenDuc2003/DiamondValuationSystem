package com.diamondvaluation.admin.service.imp;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.diamondvaluation.admin.exception.UsernameNotFoundException;
import com.diamondvaluation.admin.repository.UserRepository;
import com.diamondvaluation.admin.request.AuthRequest;
import com.diamondvaluation.admin.response.AuthResponse;
import com.diamondvaluation.admin.security.jwt.JwtUtils;
import com.diamondvaluation.admin.service.AuthService;
import com.diamondvaluation.common.User;
@Service
public class AuthServiceImp implements AuthService{
	private final UserRepository userRepository;
	private final JwtUtils jwtUtils;
	private final AuthenticationManager authenticationManager;
	
	@Autowired
	public AuthServiceImp(UserRepository userRepository, JwtUtils jwtUtils,
			AuthenticationManager authenticationManager) {
		this.userRepository = userRepository;
		this.jwtUtils = jwtUtils;
		this.authenticationManager = authenticationManager;
	}


	@Override
	public AuthResponse login(AuthRequest authRequest) {
		
		authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );
        Optional<User> userOptional = userRepository.findByUsername(authRequest.getUsername());
        if (userOptional.isPresent()) {
        	
        	User user = userOptional.get();
            String token = jwtUtils.generateAccessToken(userOptional.get());
            return new AuthResponse(user.getId(), user.getEmail(), user.getFullname(), token,user.getListRoles());
        }
        
        return null;
	}

	@Override
	public Optional<User> findByUsername(String username) {
		Optional<User> user = userRepository.findByUsername(username);
		if(!user.isPresent()) {
			throw new UsernameNotFoundException("User is not exist!");
		}
		return user; 
	}

}
