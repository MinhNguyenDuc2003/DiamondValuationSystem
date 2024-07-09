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
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReportRequest {
	
	private Integer id;
	@NotNull @NotBlank (message = "content name cannnot be null")
	private String content;
	@NotNull @NotBlank (message = "content name cannnot be null")
	private String header;
	
	private String status;
	@NotNull @NotBlank (message = "content name cannnot be null")
	private String type;
	
	@NotNull
	private Integer request_id;
}
