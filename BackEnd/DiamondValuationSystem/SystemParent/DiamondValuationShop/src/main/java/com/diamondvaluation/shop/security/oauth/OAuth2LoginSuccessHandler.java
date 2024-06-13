package com.diamondvaluation.shop.security.oauth;

import org.hibernate.validator.internal.util.stereotypes.Lazy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.diamondvaluation.common.AuthenticationType;
import com.diamondvaluation.common.Customer;
import com.diamondvaluation.shop.service.CustomerService;

import io.jsonwebtoken.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {
	@Lazy
	private final CustomerService cusService;
	
	
	@Autowired
	public OAuth2LoginSuccessHandler(CustomerService cusService) {
		super();
		this.cusService = cusService;
	}

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws ServletException, IOException, java.io.IOException {
		CustomOAuth2User oauth2User = (CustomOAuth2User) authentication.getPrincipal();
		String name = oauth2User.getName();
		String email = oauth2User.getEmail();
		String countryCode = request.getLocale().getCountry();
		String clientName = oauth2User.getClientName();
		
		Customer customer = cusService.getCustomerByEmail(email);
		if(customer==null) {
			cusService.addNewCustomerUponOAuthLogin(name, email, countryCode, getAuthenticationType(clientName));
		}else {
			cusService.updateAuthenticationType(customer, getAuthenticationType(clientName));
		}
		
		super.onAuthenticationSuccess(request, response, authentication);
	}
	
	private AuthenticationType getAuthenticationType(String clientName) {
		if(clientName.equals("Google")) {
			return AuthenticationType.GOOGLE;
		}
		else if(clientName.equals("Facebool")) {
			return AuthenticationType.FACEBOOK;
		} 
		else{
			return AuthenticationType.DATABASE;
		}
	}
	
}
