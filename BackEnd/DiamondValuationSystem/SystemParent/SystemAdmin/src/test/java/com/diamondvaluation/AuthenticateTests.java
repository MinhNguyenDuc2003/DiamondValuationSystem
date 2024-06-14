package com.diamondvaluation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.ContextConfiguration;

import com.diamondvaluation.admin.SystemAdminApplication;
import com.diamondvaluation.admin.security.user.CustomUserDetails;

@SpringBootTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
@ContextConfiguration(classes = SystemAdminApplication.class)
public class AuthenticateTests {
	@Autowired AuthenticationManager authManager;
	
	@Test
	public void testUserNameFail() {
		assertThrows(BadCredentialsException.class, () -> {
			authManager.authenticate(new UsernamePasswordAuthenticationToken("abcd@minhds", "password123"));
		});
	}
	
	@Test
	public void testPasswordFail() {
		assertThrows(BadCredentialsException.class, () -> {
			authManager.authenticate(new UsernamePasswordAuthenticationToken("example@example.com", "xxx"));
		});
	}
	
	@Test
	public void testAuthenticationSuccess() {
		String username = "example@example.com";
		String password = "password123";
		
		Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
		
		assertThat(authentication.isAuthenticated()).isTrue();
		
		CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
		
		assertThat(userDetails.getUsername()).isEqualTo(username);
	}
}
