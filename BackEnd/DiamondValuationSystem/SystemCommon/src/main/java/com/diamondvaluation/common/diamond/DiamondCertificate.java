package com.diamondvaluation.common.diamond;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.diamondvaluation.common.DiamondRequest;

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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "diamond_certificates")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class DiamondCertificate {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	private String name;
	
	private String photo;

	@Column(length = 28, nullable = false, unique = false)
	private float carat;

	@Column(nullable = false, unique = false)
	@Enumerated(EnumType.STRING)
	private DiamondColor color;

	@Column(nullable = false, unique = false)
	@Enumerated(EnumType.STRING)
	private DiamondCut cut;

	@Column(nullable = false, unique = false)
	@Enumerated(EnumType.STRING)
	private DiamondClarity clarity;

	@Column(nullable = false, unique = false)
	@Enumerated(EnumType.STRING)
	private DiamondMake make;

	@CreatedDate
	private LocalDateTime createdDate;

	@LastModifiedDate
	private LocalDateTime lastModifiedDate;

	@OneToOne(cascade = CascadeType.MERGE)
	@JoinColumn(name = "request_id")
	private DiamondRequest request;

	private String measurement;

	@Column(nullable = false, unique = false)
	@Enumerated(EnumType.STRING)
	private DiamondPolish polish;

	@Column(nullable = false, unique = false)
	@Enumerated(EnumType.STRING)
	private DiamondSymmetry symmetry;

	@Column(nullable = false, unique = false)
	@Enumerated(EnumType.STRING)
	private DiamondFluorescence flourescence;

}
