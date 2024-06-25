package com.diamondvaluation.common;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "diamond_valuation")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DiamondValuation {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(name = "rap_price")
	private double rapPrice;
	
	@Column(name = "rap_percent")
	private double rapPercent;
	
	@Column(name ="real_price")
	private double realPrice;
	
	@Column(name = "min_price")
	private double minPrice;
	
	@Column(name = "max_price")
	private double maxPrice;
	
}
