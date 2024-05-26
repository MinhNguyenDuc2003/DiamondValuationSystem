package com.diamondvaluation.admin.service;

import java.util.Optional;

import com.diamondvaluation.admin.request.AuthRequest;
import com.diamondvaluation.admin.response.AuthResponse;
import com.diamondvaluation.admin.response.TokenResponse;
import com.diamondvaluation.common.User;

public interface AuthService {
	TokenResponse login(AuthRequest authRequest);
	Optional<User> findByUsername(String name);
}
