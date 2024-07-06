package com.diamondvaluation.admin.request;

import com.atlassian.util.concurrent.NotNull;

import jakarta.validation.constraints.NotBlank;
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
