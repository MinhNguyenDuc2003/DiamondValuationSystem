package com.diamondvaluation.shop.service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.diamondvaluation.common.Customer;
import com.diamondvaluation.common.RefreshToken;
import com.diamondvaluation.shop.exception.RefreshTokenExpiredException;
import com.diamondvaluation.shop.exception.RefreshTokenNotFoundException;
import com.diamondvaluation.shop.repository.RefreshTokenRepository;
import com.diamondvaluation.shop.request.RefreshTokenRequest;
import com.diamondvaluation.shop.response.TokenResponse;
import com.diamondvaluation.shop.security.jwt.JwtUtils;


@Service
public class TokenService {
	@Value("${app.security.jwt.refresh-token.expiration}")
	private int refreshTokenExpiration;
	
	@Autowired RefreshTokenRepository refreshTokenRepo;
	
	@Autowired JwtUtils jwtUtil;
	
	@Autowired PasswordEncoder passwordEncoder;
	
	@Transactional
	public TokenResponse generateTokens(Customer customer) {
		String accessToken = jwtUtil.generateAccessToken(customer);
		
		TokenResponse response = new TokenResponse();
		response.setToken(accessToken);
		
		String randomUUID = UUID.randomUUID().toString();
		
		response.setRefreshToken(randomUUID);
		
		RefreshToken refreshToken = new RefreshToken();
		refreshToken.setUserType("customer");
		refreshToken.setCustomer(customer);
		refreshToken.setToken(passwordEncoder.encode(randomUUID));
		
		long refreshTokenExpirationInMillis = System.currentTimeMillis() + refreshTokenExpiration * 60000;
		refreshToken.setExpiryTime(new Date(refreshTokenExpirationInMillis));
		
		refreshTokenRepo.save(refreshToken);
		
		return response;
	}
	@Transactional
	public TokenResponse refreshTokens(RefreshTokenRequest request) throws RefreshTokenNotFoundException, RefreshTokenExpiredException {
		String rawRefreshToken = request.getRefreshToken();
		
		List<RefreshToken> listRefreshTokens = refreshTokenRepo.findByCustomerId(Integer.parseInt(request.getId()));
		
		RefreshToken foundRefreshToken = null;
		
		for (RefreshToken token : listRefreshTokens) {
			if (passwordEncoder.matches(rawRefreshToken, token.getToken())) {
				foundRefreshToken = token;
			}
		}
		
		if (foundRefreshToken == null)
			throw new RefreshTokenNotFoundException();
		
		Date currentTime = new Date();
		
		if (foundRefreshToken.getExpiryTime().before(currentTime))
			throw new RefreshTokenExpiredException();
		try {
            TokenResponse response = generateTokens(foundRefreshToken.getCustomer());
            return response;
        } catch (OptimisticLockingFailureException e) {
            throw new RuntimeException("Failed to update refresh token due to concurrent modification", e);
        }
	}
}
