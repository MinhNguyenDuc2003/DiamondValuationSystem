package com.diamondvaluation.admin.service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.diamondvaluation.admin.exception.RefreshTokenExpiredException;
import com.diamondvaluation.admin.exception.RefreshTokenNotFoundException;
import com.diamondvaluation.admin.repository.RefreshTokenRepository;
import com.diamondvaluation.admin.request.RefreshTokenRequest;
import com.diamondvaluation.admin.response.TokenResponse;
import com.diamondvaluation.admin.security.jwt.JwtUtils;
import com.diamondvaluation.common.RefreshToken;
import com.diamondvaluation.common.User;


@Service
public class TokenService {
	@Value("${app.security.jwt.refresh-token.expiration}")
	private int refreshTokenExpiration;
	
	@Autowired RefreshTokenRepository refreshTokenRepo;
	
	@Autowired JwtUtils jwtUtil;
	
	@Autowired PasswordEncoder passwordEncoder;
	
	@Transactional
	public TokenResponse generateTokens(User user) {
		String accessToken = jwtUtil.generateAccessToken(user);
		
		TokenResponse response = new TokenResponse();
		response.setToken(accessToken);
		
		String randomUUID = UUID.randomUUID().toString();
		
		response.setRefreshToken(randomUUID);
		
		RefreshToken refreshToken = new RefreshToken();
		refreshToken.setUserType("user");
		refreshToken.setUser(user);
		refreshToken.setToken(passwordEncoder.encode(randomUUID));
		
		long refreshTokenExpirationInMillis = System.currentTimeMillis() + refreshTokenExpiration * 60000;
		refreshToken.setExpiryTime(new Date(refreshTokenExpirationInMillis));
		
		refreshTokenRepo.save(refreshToken);
		
		return response;
	}
	@Transactional
	public TokenResponse refreshTokens(RefreshTokenRequest request) throws RefreshTokenNotFoundException, RefreshTokenExpiredException {
		String rawRefreshToken = request.getRefreshToken();
		
		List<RefreshToken> listRefreshTokens = refreshTokenRepo.findByUserId(Integer.parseInt(request.getId()));
		
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
            TokenResponse response = generateTokens(foundRefreshToken.getUser());
            return response;
        } catch (OptimisticLockingFailureException e) {
            throw new RuntimeException("Failed to update refresh token due to concurrent modification", e);
        }
	}
}
