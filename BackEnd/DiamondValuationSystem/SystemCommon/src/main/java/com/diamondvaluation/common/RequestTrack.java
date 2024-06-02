package com.diamondvaluation.common;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "request_tracking")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RequestTrack {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	private String note;
	
	@Column(nullable = false, unique = false)
	@Enumerated(EnumType.STRING)
	private RequestStatus status;
	
	@Column(name = "updated_time")
	private Date updatedTime;
	
	@OneToOne
	@JoinColumn(name = "user_id")
	private User updatedBy;
	
	@ManyToOne
	@JoinColumn(name = "request_id")
	private DiamondRequest request;
}
