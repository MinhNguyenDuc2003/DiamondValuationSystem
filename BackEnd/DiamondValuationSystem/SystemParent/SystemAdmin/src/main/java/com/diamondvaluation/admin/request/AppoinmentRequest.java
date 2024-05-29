package com.diamondvaluation.admin.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
public class AppoinmentRequest {
	
	private Integer id;
	
	@NotBlank (message = "Meeting date cannnot be null")
//	@Pattern(regexp = "^(\\\\d{2})-(\\\\d{2})-(\\\\\\\\d{4})$", message = "Invalid meeting_date format")
	private LocalDate meeting_date;
	
	@NotBlank (message = "Meeting time cannnot be null")
//	@Pattern(regexp = "^(\\\\d{2})/(\\\\d{2})/(\\\\\\\\d{4})$", message = "Invalid time format")
	private String meeting_time;
	
	private Integer user_id;
	
	private Integer customer_id;
	
	private String note;
	
	private boolean status;
	
	
	
	
}
