package com.diamondvaluation.admin.controller;

import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.admin.exception.JwtValidationException;
import com.diamondvaluation.admin.exception.PasswordNotRightException;
import com.diamondvaluation.admin.exception.RefreshTokenExpiredException;
import com.diamondvaluation.admin.exception.RefreshTokenNotFoundException;
import com.diamondvaluation.admin.exception.UsernameNotFoundException;
import com.diamondvaluation.admin.request.AuthRequest;
import com.diamondvaluation.admin.request.RefreshTokenRequest;
import com.diamondvaluation.admin.response.TokenResponse;
import com.diamondvaluation.admin.security.jwt.JwtUtils;
import com.diamondvaluation.admin.security.user.CustomUserDetailsService;
import com.diamondvaluation.admin.service.AuthService;
import com.diamondvaluation.admin.service.TokenService;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth/")
@Validated
public class AuthController {
	 private final AuthService authService;
	 private final TokenService tokenService;
	 private final JwtUtils jwtUtils;
	 private final CustomUserDetailsService userDetailsService;
	 
	 @Autowired
	 public AuthController(AuthService authService, TokenService tokenService, JwtUtils jwtUtils, CustomUserDetailsService userDetailsService) {
	        this.authService = authService;
	        this.jwtUtils = jwtUtils;
	        this.tokenService = tokenService;
	        this.userDetailsService = userDetailsService;
	    }
	
	@PostMapping("sign-in")
	public ResponseEntity<?> signIn(@Valid @RequestBody AuthRequest authRequest, HttpServletResponse response
			, HttpServletRequest request) throws BadRequestException{
		try {
			
			TokenResponse token = authService.login(authRequest);
			if(token!=null) {
				setRefreshToken4Cookies(response, request, token.getRefreshToken());
			}
			return new ResponseEntity<>(token, HttpStatus.OK);
		} catch (UsernameNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.OK).build();
		} catch (PasswordNotRightException ex) {
			return ResponseEntity.status(HttpStatus.OK).build();
		}
		
	}
	
	
	@PostMapping("/token/refresh")
	public ResponseEntity<?> refreshToken(@CookieValue(name = "adminRefreshToken", required = false) String refreshToken
			, HttpServletResponse response
			, HttpServletRequest request
			, @RequestParam("id") String id) {
		try {
			if(refreshToken == null) {
				return ResponseEntity.status(403).body("Invalid refresh token");
			}
			TokenResponse responseToken = tokenService.refreshTokens(new RefreshTokenRequest(id, refreshToken));
			
			setRefreshToken4Cookies(response, request, responseToken.getRefreshToken());
			return ResponseEntity.ok(responseToken);
			
		} catch (RefreshTokenNotFoundException | RefreshTokenExpiredException e) {
			e.printStackTrace();
			return ResponseEntity.status(403).body("Invalid refresh token");
		}
		
	}
	
	@PostMapping("/token")
	public ResponseEntity<?> accessToken() {
		return ResponseEntity.ok().build();
	}
	
	private void setRefreshToken4Cookies(HttpServletResponse response, HttpServletRequest request, String refreshToken) {
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
		    for (Cookie cookie : cookies) {
		        if (cookie.getName().equals("adminRefreshToken")) {
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
		Cookie refreshTokenCookie = new Cookie("adminRefreshToken", refreshToken);
		refreshTokenCookie.setHttpOnly(true);
		refreshTokenCookie.setSecure(true);
		refreshTokenCookie.setPath("/");
		refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
		response.addCookie(refreshTokenCookie);
	}
	
	@GetMapping("logout/{id}")
	public ResponseEntity<?> logout(@PathVariable("id") String id){
		tokenService.deleteAllRefreshTokenById(Integer.parseInt(id));
		return ResponseEntity.ok().build();
	}
	

}
