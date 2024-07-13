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
@JsonPropertyOrder({"id", "content", "name", "status","type","request_id","user_id"})
public class ReportResponse {
	private Integer id;
	
	private String content;
	
	private String name;
	
	private String status;
	
	private String type;
	
	private Integer request_id;
}
