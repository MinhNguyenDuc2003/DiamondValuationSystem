package com.diamondvaluation.admin.controller;

import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.admin.request.AuthRequest;
import com.diamondvaluation.admin.response.TokenResponse;
import com.diamondvaluation.admin.security.jwt.JwtUtils;
import com.diamondvaluation.admin.service.AuthService;
import com.diamondvaluation.admin.service.UserService;
import com.diamondvaluation.admin.service.imp.AuthServiceImp;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth/")
@Validated
public class AuthController {
	 private final AuthService authService;
	 private final JwtUtils utils;
	 private final UserService userService;
	 
	 @Autowired
	 public AuthController(AuthServiceImp authService, JwtUtils utils, UserService user) {
	        this.authService = authService;
	        this.utils = utils;
	        this.userService=user;
	    }
	
	@PostMapping("sign-in")
	public ResponseEntity<?> signIn(@Valid @RequestBody AuthRequest authRequest) throws BadRequestException{
		TokenResponse token = authService.login(authRequest);
		return new ResponseEntity<>(token, HttpStatus.OK);
	}
	
	

}
