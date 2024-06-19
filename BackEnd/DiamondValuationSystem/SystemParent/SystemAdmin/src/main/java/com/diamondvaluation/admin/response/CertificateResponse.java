package com.diamondvaluation.admin.response;

import com.diamondvaluation.common.diamond.DiamondClarity;
import com.diamondvaluation.common.diamond.DiamondColor;
import com.diamondvaluation.common.diamond.DiamondCut;
import com.diamondvaluation.common.diamond.DiamondFluorescence;
import com.diamondvaluation.common.diamond.DiamondMake;
import com.diamondvaluation.common.diamond.DiamondPolish;
import com.diamondvaluation.common.diamond.DiamondSymmetry;
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
	
	private DiamondClarity clarity;
	
	private DiamondFluorescence flourescence;
	
	private DiamondMake make;
	
	private DiamondPolish polish;
	
	private DiamondSymmetry symmetry;
	
	private DiamondColor color;
	
	private DiamondCut cut;
	
	private String name;
}
