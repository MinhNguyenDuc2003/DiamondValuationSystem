package com.diamondvaluation.shop.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonPropertyOrder({"id","email", "full_name", "token", "refresh_token"})
@Getter
public class AuthResponse {
	private String id;
	private String email;
	private String token;
	private String refreshToken;

	public AuthResponse(String id, String email, String token, String refreshToken) {
		this.email = email;
		this.token = token;
		this.refreshToken = refreshToken;
		this.id = id;
	}    

}
