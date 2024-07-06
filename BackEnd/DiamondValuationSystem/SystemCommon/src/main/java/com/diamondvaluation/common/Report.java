package com.diamondvaluation.common;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "reports")	
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Report {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(nullable = false, unique = false)
	private String header;
	
	@Column(nullable = false, unique = false)
	private String content;
	
	@Column(nullable = false, unique = false)
	@Enumerated(EnumType.STRING)
	private ReportType type;
	
	@Column(name = "created_time")
	@CreatedDate
	private LocalDateTime createdTime;
	
	@OneToMany(mappedBy = "report", cascade = CascadeType.ALL)
	private List<ReportTracking> reportTracking;
	
	@LastModifiedDate
	private LocalDateTime lastModifiedDate;
	
	@Column(nullable = false, unique = false)
	private boolean status;
	
	@ManyToOne
	@JoinColumn(name= "request_id")
	private DiamondRequest request;
}
