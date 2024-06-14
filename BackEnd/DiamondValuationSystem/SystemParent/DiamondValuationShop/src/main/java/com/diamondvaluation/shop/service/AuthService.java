package com.diamondvaluation.shop.service;

import java.util.Optional;

import com.diamondvaluation.common.Customer;
import com.diamondvaluation.shop.request.AuthRequest;
import com.diamondvaluation.shop.response.AuthResponse;

public interface AuthService {
	AuthResponse login(AuthRequest authRequest);

	Customer signup(Customer request2Entity);

	boolean verify(String code);
	
}
