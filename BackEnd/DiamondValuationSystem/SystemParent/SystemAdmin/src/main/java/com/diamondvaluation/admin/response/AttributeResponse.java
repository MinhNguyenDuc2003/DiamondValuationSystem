package com.diamondvaluation.admin.response;

import com.diamondvaluation.common.diamond.DiamondClarity;
import com.diamondvaluation.common.diamond.DiamondColor;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data
@Getter
@Setter
public class AttributeResponse {
	private Integer Id;
	
	@Enumerated(EnumType.STRING)
	private DiamondClarity clarity;
	
	@Enumerated(EnumType.STRING)
	private DiamondColor color;
	
	private float number;
	
}
