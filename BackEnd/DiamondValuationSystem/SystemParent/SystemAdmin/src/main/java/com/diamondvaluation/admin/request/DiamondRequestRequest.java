package com.diamondvaluation.admin.request;

import java.util.List;

import com.diamondvaluation.common.PaymentMethod;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class DiamondRequestRequest {
	private Integer id;
	
	@NotNull (message = "customer cannnot be null")
	private Integer customer_id;
	
	private String note;
	
	private String status;
	
	@NotNull
	private List<String> service_ids;
	@NotNull
	private boolean paid;
	@NotNull 
	@Enumerated(EnumType.STRING)
	private PaymentMethod payment_method;
	
	private String appointmentDate;
	@NotNull @NotBlank     
	private String slotId;
	
}
