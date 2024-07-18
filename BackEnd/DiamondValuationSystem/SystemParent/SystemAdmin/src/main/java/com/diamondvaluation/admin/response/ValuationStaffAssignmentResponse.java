package com.diamondvaluation.admin.response;

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
public class ValuationStaffAssignmentResponse {
	private Integer assignmentid;
	private String name;
	private int numberRequestProcessing;
	private String phoneNumber;
}
