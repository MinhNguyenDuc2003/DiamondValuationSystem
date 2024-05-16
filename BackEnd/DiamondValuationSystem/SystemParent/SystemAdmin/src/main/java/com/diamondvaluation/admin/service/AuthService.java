package com.diamondvaluation.admin.service;

import java.util.Optional;

import com.diamondvaluation.admin.request.AuthRequest;
import com.diamondvaluation.admin.response.AuthResponse;
import com.diamondvaluation.common.User;

public interface AuthService {
	AuthResponse login(AuthRequest authRequest);
	Optional<User> findByUsername(String name);
}
