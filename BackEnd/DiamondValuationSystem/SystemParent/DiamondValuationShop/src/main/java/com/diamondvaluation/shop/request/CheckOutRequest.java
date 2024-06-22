package com.diamondvaluation.shop.request;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CheckOutRequest {
	@JsonProperty("payment_method")
	@NotNull @NotBlank(message = "payment method cannot be blank!")
	private String payment_method;
	
	@JsonProperty("serviceId")
	@NotNull(message = "service cannot be blank!")
	private List<String> serviceId;
	
	@JsonProperty("note")
	private String note;
}
