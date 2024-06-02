package com.diamondvaluation.admin.response;

import com.diamondvaluation.admin.request.ServiceRequest;

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
public class ServiceResponse {
	private Integer id;
	
	private String name;
	
	private float money;
	
	private String content;
	
	private String photo;
}