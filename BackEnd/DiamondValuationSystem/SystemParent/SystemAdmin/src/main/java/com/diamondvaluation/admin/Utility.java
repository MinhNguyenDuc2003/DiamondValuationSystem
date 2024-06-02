package com.diamondvaluation.admin;

import org.springframework.security.authentication.RememberMeAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import com.diamondvaluation.admin.security.user.CustomUserDetails;
import com.diamondvaluation.common.User;

import jakarta.servlet.http.HttpServletRequest;

public class Utility {
	public static User getIdOfAuthenticatedUser(HttpServletRequest request) {
		Object principal = request.getUserPrincipal();
		if (principal == null)
			return null;

		User user = null;

		if (principal instanceof UsernamePasswordAuthenticationToken
				|| principal instanceof RememberMeAuthenticationToken) {
			CustomUserDetails userDetail = (CustomUserDetails) request.getUserPrincipal();
			user = userDetail.getUser();
		}
		return user;
	}
}