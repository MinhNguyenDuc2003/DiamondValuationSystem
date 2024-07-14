package com.diamondvaluation.admin.response;

import java.time.LocalDateTime;

import com.diamondvaluation.common.DiamondRequest;
import com.diamondvaluation.common.diamond.DiamondClarity;
import com.diamondvaluation.common.diamond.DiamondColor;
import com.diamondvaluation.common.diamond.DiamondCut;
import com.diamondvaluation.common.diamond.DiamondFluorescence;
import com.diamondvaluation.common.diamond.DiamondMake;
import com.diamondvaluation.common.diamond.DiamondPolish;
import com.diamondvaluation.common.diamond.DiamondSymmetry;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

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
@JsonPropertyOrder({"id", "clarity"})
public class CertificateResponse {
	private Integer id;
	
	private float carat;
	
	private String code;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "MM dd yyyy")
	private LocalDateTime created_date;
	
	private DiamondClarity clarity;
	
	private DiamondFluorescence flourescence;
	
	private DiamondMake make;
	
	private DiamondPolish polish;
	
	private DiamondSymmetry symmetry;
	
	private DiamondColor color;
	
	private DiamondCut cut;
	
	private Integer requestId;
	
	private String measurement;
	
	private String name;

	private Integer valuationId;
	
	private double maxPrice;
	
	private double minPrice;
	
	private double rapPercent;
	
	private double rapPrice;
	
	private double realPrice;
	
	private String photo;
}
