package com.diamondvaluation.admin.response;

import java.time.LocalDate;
import java.util.Date;

import com.diamondvaluation.admin.request.AppoinmentRequest;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class AppoinmentResponse {
	private Integer id;
	
	private String userName;
	
	private String customerPhone;
	
	private Date createdTime;
	
	private LocalDate meetingDate;
	
	private String meetingTime;
	
	private String note;
	
	private boolean status;
}
