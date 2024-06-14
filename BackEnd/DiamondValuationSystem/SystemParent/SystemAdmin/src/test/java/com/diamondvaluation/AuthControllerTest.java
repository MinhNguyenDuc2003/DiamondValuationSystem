package com.diamondvaluation;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import com.diamondvaluation.admin.SystemAdminApplication;
import com.diamondvaluation.admin.request.AuthRequest;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
@ContextConfiguration(classes = SystemAdminApplication.class)
@AutoConfigureMockMvc
public class AuthControllerTest {
	private static final String LOGIN = "/api/auth/sign-in";
	
	@Autowired MockMvc mockMvc;
	@Autowired ObjectMapper objectMapper;
	
	@Test
	public void testGetAccessTokenSuccess() throws Exception {
		AuthRequest request = new AuthRequest();
		request.setEmail("example@example.com");
		request.setPassword("password123");
		
		String requestBody = objectMapper.writeValueAsString(request);
		
		mockMvc.perform(post(LOGIN)
				.contentType("application/json").content(requestBody))
			.andDo(print())
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.token").isNotEmpty())
			.andExpect(jsonPath("$.refresh_token").isNotEmpty());
	}
	
	@Test
	public void testLoginFailReturn401() throws Exception {
		AuthRequest request = new AuthRequest();
		request.setEmail("abc@example.com");
		request.setPassword("password123");
		
		String requestBody = objectMapper.writeValueAsString(request);
		
		mockMvc.perform(post(LOGIN)
				.contentType("application/json").content(requestBody))
			.andDo(print())
			.andExpect(status().isUnauthorized());
	}
	
}
