package com.diamondvaluation.shop.response;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

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
public class CustomerResponse {
	private String id;
	
	private String email;

	private String firstName;

	private String lastName;

	private String phoneNumber;
	
	private String location;
}
