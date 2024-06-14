package com.diamondvaluation.shop.request;

import org.hibernate.validator.constraints.Length;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequest {
	@NotNull @Length(min = 5, max = 50)
	@NotBlank(message = "Email is required")
    @Pattern(regexp = ".+@.+\\..+", message = "Invalid email format")
	private String email;
	
	@NotNull @Length(min = 5) @NotBlank
	private String password;
	
}
