package com.diamondvaluation.shop.controller;

import java.io.UnsupportedEncodingException;
import java.util.Map;

import org.apache.coyote.BadRequestException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.common.Customer;
import com.diamondvaluation.shop.EmailSettingBag;
import com.diamondvaluation.shop.Utility;
import com.diamondvaluation.shop .exception.CustomerIsAlreadyExistException;
import com.diamondvaluation.shop.exception.CustomerNotFoundException;
import com.diamondvaluation.shop.exception.RefreshTokenExpiredException;
import com.diamondvaluation.shop.exception.RefreshTokenNotFoundException;
import com.diamondvaluation.shop.request.AuthRequest;
import com.diamondvaluation.shop.request.RefreshTokenRequest;
import com.diamondvaluation.shop.request.SignUpRequest;
import com.diamondvaluation.shop.response.AuthResponse;
import com.diamondvaluation.shop.response.TokenResponse;
import com.diamondvaluation.shop.security.jwt.JwtUtils;
import com.diamondvaluation.shop.security.oauth.GoogleOAuth2Service;
import com.diamondvaluation.shop.service.AuthService;
import com.diamondvaluation.shop.service.CustomerService;
import com.diamondvaluation.shop.service.SettingService;
import com.diamondvaluation.shop.service.TokenService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/diamond-shop")
public class AuthController {
	private final AuthService authService;
	private final TokenService tokenService;
	private final JwtUtils jwtUtils;
	private final ModelMapper modelMapper;
	private final SettingService settingService;
	private final GoogleOAuth2Service googleOAuth2Service;
	private final CustomerService customerService;
	@Value("${baseUrl}")
	private String SITEURL;

	@Autowired
	public AuthController(AuthService authService, TokenService tokenService, JwtUtils jwtUtils,
			ModelMapper modelMapper, SettingService settingService, GoogleOAuth2Service googleOAuth2Service
			,CustomerService customerService) {
		this.authService = authService;
		this.tokenService = tokenService;
		this.jwtUtils = jwtUtils;
		this.modelMapper = modelMapper;
		this.settingService = settingService;
		this.googleOAuth2Service = googleOAuth2Service;
		this.customerService = customerService;
	}

	@PostMapping("/login")
	public ResponseEntity<?> signIn(@Valid @RequestBody AuthRequest authRequest, HttpServletResponse response,
			HttpServletRequest request) throws BadRequestException {
		try {
			AuthResponse resposne = authService.login(authRequest);
			if (resposne != null) {
				setRefreshToken4Cookies(response, request, resposne.getRefreshToken());
			} else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
			}
			return new ResponseEntity<>(resposne, HttpStatus.OK);
		} catch (CustomerNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}

	@PostMapping("/token/refresh")
	public ResponseEntity<?> refreshToken(@CookieValue(name = "refreshToken", required =false) String refreshToken,
			HttpServletResponse response, HttpServletRequest request, @RequestParam("id") String id) {
		try {
			if(refreshToken == null) {
				return ResponseEntity.status(403).body("Invalid refresh token");
			}
			TokenResponse responseToken = tokenService.refreshTokens(new RefreshTokenRequest(id, refreshToken));
			System.out.println(responseToken.getToken());
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
	public ResponseEntity<?> accessToken() {
			return ResponseEntity.ok().build();
	}

	@PostMapping("/signup")
	public ResponseEntity<?> registerCustomer(@Valid @RequestBody SignUpRequest requestDTO, HttpServletRequest request)
			throws UnsupportedEncodingException, MessagingException {
		try {
			Customer customer = authService.signup(request2Entity(requestDTO));
			sendVerificationEmail(request, customer);
			return ResponseEntity.ok().body("Sign up successfully!");
		} catch (CustomerIsAlreadyExistException e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).build();
		}
	}

	@GetMapping("/verify")
	public ResponseEntity<?> verifyAccount(@RequestParam("code") String code) {
		boolean verified = authService.verify(code);
		if (verified) {
			return ResponseEntity.ok().body("Verify account successfully");
		} else {
			return ResponseEntity.badRequest().body("Your verification request is fail!");
		}
	}

	private void setRefreshToken4Cookies(HttpServletResponse response, HttpServletRequest request,
			String refreshToken) {
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

	@PostMapping("/forgot-password")
	public ResponseEntity<?> processResetPassword(@RequestParam("email") String email)
			throws UnsupportedEncodingException, MessagingException {
		try {
			String token = authService.updateResetPasswordToken(email);
			String link = SITEURL + "reset-password?code=" + token;
			sendResetPasswordEmail(link, email);
			return ResponseEntity.ok().build();
		} catch (CustomerNotFoundException e) {
			return ResponseEntity.badRequest().build();
		}
	}

	@PostMapping("/reset-password")
	public ResponseEntity<?> setNewPassword(@RequestParam("code") String code,
			@RequestParam("password") String password) {
		try {
			authService.updatePassword(code, password);
			return ResponseEntity.ok().build();
		} catch (CustomerNotFoundException e) {
			return ResponseEntity.badRequest().build();
		}
	}

	@GetMapping("/google/token")
	public ResponseEntity<?> handleGoogleCallback(@RequestParam("code") String code,
			HttpServletResponse response,
			HttpServletRequest request) {
		try {

			String accessToken = googleOAuth2Service.exchangeCodeForAccessToken(code);
			Map<String, Object> oauth = googleOAuth2Service.getUserInfo(accessToken);
			String email = oauth.get("email").toString();
			Customer customer = customerService.getCustomerByEmail(email);
			TokenResponse token = tokenService.generateTokens(customer);
			if (token != null) {
				setRefreshToken4Cookies(response, request, token.getRefreshToken());
			} else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
			}
			AuthResponse authResponse = new AuthResponse();
			authResponse.setEmail(email);
			authResponse.setToken(token.getToken());
			authResponse.setId(customer.getId() + "");
			return ResponseEntity.ok().body(authResponse);
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}

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

		String verifyURL = SITEURL + "verify?code=" + customer.getVerificationCode();

		content = content.replace("[[URL]]", verifyURL);

		helper.setText(content, true);

		mailSender.send(message);

		System.out.println("to Address: " + toAddress);
		System.out.println("Verify URL: " + verifyURL);
	}

	private void sendResetPasswordEmail(String link, String email)
			throws UnsupportedEncodingException, MessagingException {
		EmailSettingBag emailSettings = settingService.getEmailSettings();
		JavaMailSenderImpl mailSender = Utility.prepareMailSender(emailSettings);

		String toAddress = email;
		String subject = "Here's the link to reset your password";

		String content = "<p>Hello,</p>" + "<p>You have requested to reset your password.</p>"
				+ "Click the link below to change your password:</p>" + "<p><a href=\"" + link
				+ "\">Change my password</a></p>" + "<br>" + "<p>Ignore this email if you do remember your password, "
				+ "or you have not made the request.</p>";

		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message);

		helper.setFrom(emailSettings.getFromAddress(), emailSettings.getSenderName());
		helper.setTo(toAddress);
		helper.setSubject(subject);

		helper.setText(content, true);
		mailSender.send(message);
	}
}
