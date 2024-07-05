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
	@NotBlank(message = "Payment method is required")
    private String paymentMethod;

	@JsonProperty("service_name")
    private List<String> serviceName;

    @NotBlank(message = "Date is required")
    private String date;
	
	@JsonProperty("note")
	private String note;
}
