package com.diamondvaluation.shop.controller;

import java.io.UnsupportedEncodingException;

import org.apache.catalina.connector.Response;
import org.apache.coyote.BadRequestException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.common.Customer;
import com.diamondvaluation.shop.EmailSettingBag;
import com.diamondvaluation.shop.Utility;
import com.diamondvaluation.shop.exception.CustomerIsAlreadyExistException;
import com.diamondvaluation.shop.exception.JwtValidationException;
import com.diamondvaluation.shop.exception.RefreshTokenExpiredException;
import com.diamondvaluation.shop.exception.RefreshTokenNotFoundException;
import com.diamondvaluation.shop.request.AuthRequest;
import com.diamondvaluation.shop.request.RefreshTokenRequest;
import com.diamondvaluation.shop.request.SignUpRequest;
import com.diamondvaluation.shop.response.AuthResponse;
import com.diamondvaluation.shop.response.TokenResponse;
import com.diamondvaluation.shop.security.jwt.JwtUtils;
import com.diamondvaluation.shop.service.AuthService;
import com.diamondvaluation.shop.service.SettingService;
import com.diamondvaluation.shop.service.TokenService;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
@RestController
@RequestMapping("/api")
public class AuthController {
	 private final AuthService authService;
	 private final TokenService tokenService;
	 private final JwtUtils jwtUtils;
	 private final ModelMapper modelMapper;
	 private final SettingService settingService; 
	 
	 @Autowired
	 public AuthController(AuthService authService, TokenService tokenService, JwtUtils jwtUtils, ModelMapper modelMapper,
			 SettingService settingService) {
	        this.authService = authService;
	        this.jwtUtils = jwtUtils;
	        this.tokenService = tokenService;
	        this.modelMapper = modelMapper;
	        this.settingService = settingService;
	 }
	 
	
	@PostMapping("/login")
	public ResponseEntity<?> signIn(@Valid @RequestBody AuthRequest authRequest, HttpServletResponse response
			, HttpServletRequest request) throws BadRequestException{
		try {
			AuthResponse resposne = authService.login(authRequest);
			if(resposne!=null) {
				setRefreshToken4Cookies(response, request, resposne.getRefreshToken());
			}else {
				return ResponseEntity.badRequest().build();
			}
			return new ResponseEntity<>(resposne, HttpStatus.OK);
		} catch (BadCredentialsException ex) {
			return ResponseEntity.ok().build();
		}		
	}
	
	
	
	
	@PostMapping("/token/refresh")
	public ResponseEntity<?> refreshToken(@CookieValue(name = "refreshToken") String refreshToken
			, HttpServletResponse response
			, HttpServletRequest request
			, @RequestParam("id") String id) {
		try {
			TokenResponse responseToken = tokenService.refreshTokens(new RefreshTokenRequest(id, refreshToken));
			
			setRefreshToken4Cookies(response, request, responseToken.getRefreshToken());
			return ResponseEntity.ok(responseToken);
			
		} catch (RefreshTokenNotFoundException | RefreshTokenExpiredException e) {
			e.printStackTrace();
			return ResponseEntity.status(403).body("Invalid refresh token");
		}
		
	}
	
	private Customer request2Entity(SignUpRequest request) {
		Customer customer = modelMapper.map(request, Customer.class);
		customer.setFirstName(request.getFirst_name());
		customer.setLastName(request.getLast_name());
		customer.setPhoneNumber(request.getPhone_number());
		return customer;
	}
	@PostMapping("/token")
	public ResponseEntity<?> accessToken(@RequestParam("token") String token) {
		try {
			jwtUtils.validateAccessToken(token);
			return ResponseEntity.ok().build();
		}catch (JwtValidationException e) {
			return ResponseEntity.status(403).build();
		}catch (ExpiredJwtException e) {
			return ResponseEntity.status(403).build();
		}
	}
	@PostMapping("/signup")
	public ResponseEntity<?> registerCustomer(@Valid @RequestBody SignUpRequest requestDTO,
			HttpServletRequest request) throws UnsupportedEncodingException, MessagingException{
		try {
			Customer customer = authService.signup(request2Entity(requestDTO));
			sendVerificationEmail(request, customer);
			return ResponseEntity.ok().body("Sign up successfully!");
		}catch (CustomerIsAlreadyExistException e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).build();
		}
	}
	
	@GetMapping("/verify")
	public ResponseEntity<?> verifyAccount(@RequestParam("code") String code) {
		boolean verified = authService.verify(code);
		if(verified) {
			return ResponseEntity.ok().body("Verify account successfully");
		}else {
			return ResponseEntity.badRequest().body("Your verification request is fail!");
		}
		
	}
	
	private void setRefreshToken4Cookies(HttpServletResponse response, HttpServletRequest request, String refreshToken) {
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
		    for (Cookie cookie : cookies) {
		        if (cookie.getName().equals("refreshToken")) {
		            // Update the existing refreshTokenCookie
		            cookie.setValue(refreshToken);
		            cookie.setPath("/");
		            cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
		            response.addCookie(cookie);
		            return;
		        }
		    }
		}

		// If the cookie doesn't exist, create a new one
		Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
		refreshTokenCookie.setHttpOnly(true);
		refreshTokenCookie.setSecure(true);
		refreshTokenCookie.setPath("/");
		refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
		response.addCookie(refreshTokenCookie);
	}
	
	private void sendVerificationEmail(HttpServletRequest request, Customer customer) 
			throws UnsupportedEncodingException, MessagingException {
		EmailSettingBag emailSettings = settingService.getEmailSettings();
		JavaMailSenderImpl mailSender = Utility.prepareMailSender(emailSettings);
		
		String toAddress = customer.getEmail();
		String subject = emailSettings.getCustomerVerifySubject();
		String content = emailSettings.getCustomerVerifyContent();
		
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message);
		
		helper.setFrom(emailSettings.getFromAddress(), emailSettings.getSenderName());
		helper.setTo(toAddress);
		helper.setSubject(subject);
		
		content = content.replace("[[name]]", customer.getFullname());
		
		String verifyURL = Utility.getSiteURL(request) + "/verify?code=" + customer.getVerificationCode();
		
		content = content.replace("[[URL]]", verifyURL);
		
		helper.setText(content, true);
		
		mailSender.send(message);
		
		System.out.println("to Address: " + toAddress);
		System.out.println("Verify URL: " + verifyURL);
	}
}
