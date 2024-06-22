package com.diamondvaluation.admin.response;

import java.util.List;

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
@JsonPropertyOrder({"id", "customer_name", "phone_number", "created_time","note","service_ids","service_names", "status", "payment_method","total", "paid"})
public class DiamondRequestResponse {
	private Integer id;
	
	private String customerName;
	
	private String customerPhone;
	
	private String createdDate;
	
	private String note;
	
	private List<String> service_ids;
	
	private String service_names;
	
	private String status;
	
	private String payment_method;
	
	private double total;
	
	private boolean paid;
	
	private String appoinment_date;
	
	private String appoinment_time;
}
