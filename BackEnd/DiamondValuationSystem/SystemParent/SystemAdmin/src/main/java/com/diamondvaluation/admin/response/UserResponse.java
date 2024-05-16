package com.diamondvaluation.admin.response;

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
@JsonPropertyOrder({"id", "email", "first_name", "last_name", "location", "password", "phone_number", "enabled","image_path", "roles"})
public class UserResponse {
	private String id;

	private String email;

	private String firstName;

	private String lastName;

	private String location;
	private String password;

	private String phoneNumber;

	private boolean enabled;
	
	private String imagePath;

	private Set<Role> roles;

	@Override
	public String toString() {
		return "UserResponse [id=" + id + ", email=" + email + ", firstName=" + firstName + ", lastName=" + lastName
				+ ", location=" + location + ", password=" + password + ", phoneNumber=" + phoneNumber + ", enabled="
				+ enabled + ", photo=" + imagePath + ", roles=" + roles + "]";
	}
	
	
}
