package com.diamondvaluation.admin.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class AssignmentResponse {
	private Integer id;
	
	private String userName;
	
	private String date;
	
	private boolean status;
	
}
