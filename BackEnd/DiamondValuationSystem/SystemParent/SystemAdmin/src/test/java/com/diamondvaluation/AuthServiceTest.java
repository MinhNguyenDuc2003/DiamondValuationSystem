package com.diamondvaluation;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.function.Executable;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ContextConfiguration;

import com.diamondvaluation.admin.SystemAdminApplication;
import com.diamondvaluation.admin.exception.PasswordNotRightException;
import com.diamondvaluation.admin.exception.UsernameNotFoundException;
import com.diamondvaluation.admin.repository.UserRepository;
import com.diamondvaluation.admin.request.AuthRequest;
import com.diamondvaluation.admin.response.TokenResponse;
import com.diamondvaluation.admin.service.TokenService;
import com.diamondvaluation.admin.service.imp.AuthServiceImp;
import com.diamondvaluation.common.User;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
@ContextConfiguration(classes = SystemAdminApplication.class)
public class AuthServiceTest {
	@MockBean private UserRepository userRepository;
	@MockBean private TokenService jwtUtils;
	@MockBean private PasswordEncoder encoder;
	
	@Autowired
	private AuthServiceImp authService;
	
	
	
	@Test
	public void testLogin_UserNameNotFound() {		
		Mockito.when(userRepository.findByUsername("abc@example.com")).thenReturn(Optional.empty());
		
		assertThrows(UsernameNotFoundException.class, new Executable() {
			
			@Override
			public void execute() throws Throwable {
				authService.findByUsername("abc@example.com");
			}
		});
	}
	
	@Test
	public void testLogin_PasswordNotFound() {
		User userInDB = new User();
		Mockito.when(userRepository.checkPasswordByUserId(88, "password123")).thenReturn(null);
		
		assertThrows(PasswordNotRightException.class, new Executable() {
			
			@Override
			public void execute() throws Throwable {
				authService.checkPaswordByUser(userInDB, "password123");
			}
		});
	}
	
	@Test
	public void testLoginSuccessfully() {
		 	String email = "example@example.com";
	        String password = "password123";
	        User mockUser = new User();
	        mockUser.setEmail(email);
	        mockUser.setPassword(encoder.encode(password)); // Encode password
	        mockUser.setEnabled(true); // Assuming the user is enabled

	        // Mocking UserRepository's behavior
	        when(userRepository.findByUsername(email)).thenReturn(Optional.of(mockUser));
	        when(encoder.matches(password, mockUser.getPassword())).thenReturn(true);

	        // Mocking TokenService's behavior
	        TokenResponse mockTokenResponse = new TokenResponse();
	        when(jwtUtils.generateTokens(mockUser)).thenReturn(mockTokenResponse);

	        // Creating an AuthRequest
	        AuthRequest request = new AuthRequest();
	        request.setEmail(email);
	        request.setPassword(password);

	        // Calling the login method and asserting the result
	        TokenResponse result = authService.login(request);
	        assertEquals(mockTokenResponse, result);
	}
}
