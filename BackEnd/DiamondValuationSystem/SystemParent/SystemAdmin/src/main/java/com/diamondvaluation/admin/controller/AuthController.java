package com.diamondvaluation.admin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.admin.repository.UserRepository;
import com.diamondvaluation.admin.request.AuthRequest;
import com.diamondvaluation.admin.response.AuthResponse;
import com.diamondvaluation.admin.response.MessageResponse;
import com.diamondvaluation.admin.service.imp.AuthServiceImp;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth/")
public class AuthController {
	 private final AuthServiceImp authService;
	 
	 @Autowired
	 public AuthController(AuthServiceImp authService, UserRepository repo) {
	        this.authService = authService;
	    }
	
	@PostMapping("sign-in")
	public ResponseEntity<AuthResponse> signIn(@Valid @RequestBody AuthRequest authRequest){
		
		 return new ResponseEntity<>(authService.login(authRequest), HttpStatus.OK);
	}
	

}
