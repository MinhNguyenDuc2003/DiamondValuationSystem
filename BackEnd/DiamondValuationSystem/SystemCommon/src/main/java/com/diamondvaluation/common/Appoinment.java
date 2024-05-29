package com.diamondvaluation.common;

import java.time.LocalDate;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "appoinments")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Appoinment {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(name = "created_time")
	private Date createdTime;
	
	@Column(name = "meeting_date")
	private LocalDate meetingDate;
	
	@Column(name = "meeting_time")
	private String meetingTime;
	
	private String note;
	
	private boolean status;
	
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User User;
	
	@ManyToOne
	@JoinColumn(name = "customer_id")
	private Customer customer;

	public Appoinment(Integer id) {
		this.id = id;
	}
	
	
	
}
