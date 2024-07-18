package com.diamondvaluation.admin.request;

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
public class ValuationStaffAssignmentRequest {
	@NotNull
	private Integer assignmentId;
	@NotNull
	private Integer requestId;
}
