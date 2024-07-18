package com.diamondvaluation.admin.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class AssignmentRequest {
	private Integer id;
	
	@NotNull @NotBlank
	private String date;
	
	@NotNull
	private boolean status;
	
	@NotNull
	private Integer userId;
}
