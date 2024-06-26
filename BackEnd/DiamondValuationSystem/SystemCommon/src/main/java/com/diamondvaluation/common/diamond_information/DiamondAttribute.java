package com.diamondvaluation.common.diamond_information;

import com.diamondvaluation.common.diamond.DiamondClarity;
import com.diamondvaluation.common.diamond.DiamondColor;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name="diamond_attributes")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DiamondAttribute {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer Id;
	
	@Column(nullable = false, unique = false)
	@Enumerated(EnumType.STRING)
	private DiamondClarity clarity;
	
	@Column(nullable = false, unique = false)
	@Enumerated(EnumType.STRING)
	private DiamondColor color;
	
	@Column(nullable = false, unique = false)
	private float number;
	
	@ManyToOne
	@JoinColumn(name = "carat_id")
	@JsonBackReference
	@JsonIgnore
	private Carat carat;
}
