package com.diamondvaluation.admin.request;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
@JsonPropertyOrder({"id", "email", "first_name", "last_name", "password", "phone_number", "enabled", "location"})
public class CustomerRequest {
	
	private String id;
	
	@NotBlank (message = "Email cannnot be null")
	@Pattern(regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$", message = "Invalid email format")
	private String email;
	
	@NotBlank(message = "first_name is required")
	private String first_name;
	
	@NotBlank(message = "last_name is required")
	private String last_name;
	
	private String password;
	
	@NotBlank(message = "Phone number is required")
    @Pattern(regexp = "\\d{10}", message = "Phone number must have 10 digits")
	private String phone_number;
	
	private String location;
	@NotNull(message = "Enable is required")
	private boolean enabled;
}
