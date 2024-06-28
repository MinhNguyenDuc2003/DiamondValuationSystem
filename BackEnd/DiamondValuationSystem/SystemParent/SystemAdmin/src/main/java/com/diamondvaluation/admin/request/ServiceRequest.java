package com.diamondvaluation.admin.request;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

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
public class ServiceRequest {
	
	private Integer id;
	@NotBlank (message = "Service name cannnot be null")
	private String name;
	
	@NotBlank(message = "Money cannot be null")
	@Pattern(regexp = "\\d+(\\.\\d{1,2})?", message = "Money must be a valid number, with up to two decimal places")
	private String money;
	
	@NotBlank (message = "Service content cannnot be null")
	private String content;
	
	
}
