package com.diamondvaluation.admin.request;

import java.util.List;

import org.hibernate.validator.constraints.Length;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "email", "first_name", "last_name", "password", "phone_number", "enabled", "roles"})
public class UserRequest {
	private String id;
	
	@NotBlank (message = "Email cannnot be null")
	@Pattern(regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$", message = "Invalid email format")
	private String email;
	
	@NotBlank(message = "first_name is required")
	@JsonProperty("first_name")
	private String first_name;
	
	@NotBlank(message = "last_name is required")
	@JsonProperty("last_name")
	private String last_name;
	
	private String password;
	
	@NotBlank(message = "Phone number is required")
    @Pattern(regexp = "\\d{10}", message = "Phone number must have 10 digits")
	@JsonProperty("phone_number")
	private String phone_number;
	
	private boolean enabled;
	@JsonProperty("roles")
	private List<String> roles;
	
}
