package com.diamondvaluation.common.diamond_information;

import com.diamondvaluation.common.diamond.DiamondClarity;
import com.diamondvaluation.common.diamond.DiamondColor;

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
import lombok.NoArgsConstructor;

@Entity
@Table(name="diamond_attributes")
@NoArgsConstructor
@AllArgsConstructor
public class DiamondAttribute {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer Id;
	
	@Column(nullable = false, unique = false)
	@Enumerated(EnumType.STRING)
	private DiamondClarity clarty;
	
	@Column(nullable = false, unique = false)
	@Enumerated(EnumType.STRING)
	private DiamondColor color;
	
	@Column(nullable = false, unique = false)
	private float number;
	
	@ManyToOne
	@JoinColumn(name = "carat_id")
	private Carat carat;
}
