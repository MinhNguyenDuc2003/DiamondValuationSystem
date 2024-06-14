package com.diamondvaluation.admin.service;

import com.diamondvaluation.admin.request.AuthRequest;
import com.diamondvaluation.admin.response.TokenResponse;
import com.diamondvaluation.common.User;

public interface AuthService {
	TokenResponse login(AuthRequest authRequest);
	boolean checkPaswordByUser(User user, String rawPassword);
	User findByUsername(String name);
}
