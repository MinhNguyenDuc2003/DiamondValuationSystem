package com.diamondvaluation.admin.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonPropertyOrder({"id", "email", "full_name", "token", "roles", "message"})
@Getter
public class AuthResponse {
	private Integer id;
	private String email;
	private String fullName;
	private String token;
	private List<String> roles;
	private String message;

	public AuthResponse(Integer id, String email,String fullname, String token, List<String> roles) {
		this.id = id;
		this.email = email;
		this.token = token;
		this.roles = roles;
		this.fullName = fullname;
	}    

}
