package com.diamondvaluation.admin.request;

import java.util.Set;

import org.hibernate.validator.constraints.Length;

import com.diamondvaluation.common.Role;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "email", "first_name", "last_name", "location", "password", "phone_number", "enabled", "roles"})
public class UserRequest {
	private String id;
	
	@NotBlank (message = "Email cannnot be null")
	@Pattern(regexp = ".+@.+\\..+", message = "Invalid email format")
	private String email;
	
	@NotBlank(message = "first_name is required")
	private String firstName;
	
	@NotBlank(message = "last_name is required")
	private String lastName;
	
	@NotBlank(message = "location is required")
	private String location;
	@Length(min = 5, max = 20, message = "password must have 5-20 characters.")
	private String password;
	
	@NotBlank(message = "Phone number is required")
    @Pattern(regexp = "\\d{10}", message = "Phone number must have 10 digits")
	private String phoneNumber;
	
	private boolean enabled;
	
	
	
	private Set<Role> roles;
}
