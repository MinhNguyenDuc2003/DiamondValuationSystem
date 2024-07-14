package com.diamondvaluation.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.RememberMeAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import com.diamondvaluation.admin.service.UserService;
import com.diamondvaluation.common.User;

import jakarta.servlet.http.HttpServletRequest;

public class Utility {
	public static User getIdOfAuthenticatedUser(HttpServletRequest request, UserService service) {
		Object principal = request.getUserPrincipal();
		if (principal == null) {
			System.out.println("abc");
			return null;
		}
		
		String customerEmail = null;
		
		if (principal instanceof UsernamePasswordAuthenticationToken 
				|| principal instanceof RememberMeAuthenticationToken) {
			customerEmail = request.getUserPrincipal().getName();
		}else {
			return null;
		}
		return service.findByUserName(customerEmail);
	}
}