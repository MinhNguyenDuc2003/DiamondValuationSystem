package com.diamondvaluation.admin.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.diamondvaluation.admin.exception.JwtValidationException;
import com.diamondvaluation.admin.security.jwt.JwtUtils;
import com.diamondvaluation.admin.security.user.CustomUserDetails;
import com.diamondvaluation.admin.security.user.CustomUserDetailsService;
import com.diamondvaluation.common.User;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class AuthTokenFilter extends OncePerRequestFilter {
	@Autowired
	private JwtUtils jwtUtils;

	@Autowired
	private CustomUserDetailsService userDetailsService;
	private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException, java.io.IOException, ExpiredJwtException {
		try {
			if (!hasAuthorizationBearer(request)) {
				filterChain.doFilter(request, response);
				return;
			}

			String jwt = parseJwt(request);
			if (!jwtUtils.isExpiredToken(jwt)) {
				if (jwt != null && !jwtUtils.validateAccessToken(jwt).isEmpty()) {
					Integer id = getUserDetails(jwt).getId();
					UserDetails userDetails = userDetailsService.loadUserById(id);
					System.out.println(userDetails.getAuthorities());
					var authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
							userDetails.getAuthorities());
					authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContextHolder.getContext().setAuthentication(authentication);
				}
			}
		} catch (Exception e) {
			logger.error("Cannot set user authentication : {} ", e.getMessage());
		}
		filterChain.doFilter(request, response);
	}

	private String parseJwt(HttpServletRequest request) {
		String headerAuth = request.getHeader("Authorization");
		if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
			return headerAuth.substring(7);
		}
		return null;
	}

	private CustomUserDetails getUserDetails(String token) throws JwtValidationException, ExpiredJwtException {
		User userDetails = new User();
		String[] jwtSubject = jwtUtils.getSubject(token).split(",");

		userDetails.setId(Integer.parseInt(jwtSubject[0]));
		userDetails.setEmail(jwtSubject[1]);

		return new CustomUserDetails(userDetails);
	}
	
	private boolean hasAuthorizationBearer(HttpServletRequest request) {
		String header = request.getHeader("Authorization");
		
		logger.info("Authorization Header: " + header);
		
		if (ObjectUtils.isEmpty(header) || !header.startsWith("Bearer")) {
			return false;
		}
		return true;
	}
}
