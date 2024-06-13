package com.diamondvaluation.shop.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonPropertyOrder({"email", "full_name", "token", "refresh_token"})
@Getter
public class AuthResponse {
	private String email;
	private String fullName;
	private String token;
	private String refreshToken;

	public AuthResponse(String email,String fullname, String token, String refreshToken) {
		this.email = email;
		this.token = token;
		this.fullName = fullname;
		this.refreshToken = refreshToken;
	}    

}
