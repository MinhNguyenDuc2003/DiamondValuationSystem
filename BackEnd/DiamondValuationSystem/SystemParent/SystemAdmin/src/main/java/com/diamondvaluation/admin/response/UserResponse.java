package com.diamondvaluation.admin.response;

import java.util.List;
import java.util.Set;

import com.diamondvaluation.common.Role;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "email", "first_name", "last_name","phone_number", "enabled","photo", "roleIds"})
public class UserResponse {
	private String id;

	private String email;

	private String firstName;

	private String lastName;

	private String phoneNumber;

	private boolean enabled;
	
	private String photo;

	private List<String> roleIds;
	
	
}
