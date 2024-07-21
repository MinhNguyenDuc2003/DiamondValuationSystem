package com.diamondvaluation.admin;

import org.springframework.security.authentication.RememberMeAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import com.diamondvaluation.admin.service.UserService;
import com.diamondvaluation.common.User;

import jakarta.servlet.http.HttpServletRequest;

public class Utility {
	public static User getIdOfAuthenticatedUser(HttpServletRequest request, UserService service) {
		Object principal = request.getUserPrincipal();
		if (principal == null) {
			System.out.println("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
			return null;
		}
		
		String customerEmail = null;
		
		if (principal instanceof UsernamePasswordAuthenticationToken) {
			customerEmail = request.getUserPrincipal().getName();
			System.out.println(customerEmail + "11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111");
		}
		return service.findByUserName(customerEmail);
	}
}