package com.diamondvaluation.shop.request;

import org.hibernate.validator.constraints.Length;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@JsonPropertyOrder({"id","email", "first_name", "last_name","phone_number","location"})
public class CustomerRequest {
	@NotNull
	private String id;
	@NotNull @Length(min = 5, max = 50)
	@NotBlank(message = "Email is required")
    @Pattern(regexp = ".+@.+\\..+", message = "Invalid email format")
	private String email;
	@NotNull
	private String firstName;
	@NotNull
	private String lastName;
	@NotNull @NotBlank
	@Pattern(regexp = "\\d{10}", message = "Phone number must have 10 digits")
	private String phoneNumber;
	@NotNull
	private String location;
}
