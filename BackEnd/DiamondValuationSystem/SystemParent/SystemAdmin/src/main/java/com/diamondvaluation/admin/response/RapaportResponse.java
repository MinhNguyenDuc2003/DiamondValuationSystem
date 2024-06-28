package com.diamondvaluation.admin.response;

import java.util.List;

import com.diamondvaluation.common.diamond_information.DiamondAttribute;
import com.fasterxml.jackson.annotation.JsonProperty;

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
public class RapaportResponse {
	@JsonProperty("begin_carat")
	private float beginCarat;
	@JsonProperty("end_carat")
	private float endCarat;
	
	private List<DiamondAttribute> list;
}
