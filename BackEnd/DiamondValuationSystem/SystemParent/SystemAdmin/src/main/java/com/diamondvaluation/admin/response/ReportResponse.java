package com.diamondvaluation.admin.response;

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
public class ReportResponse {
	private Integer id;
	
	private String content;
	
	private String header;
	
	private String status;
	
	private String type;
	
	private String created_date;
	
	private Integer request_id;
}
