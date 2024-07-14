package com.diamondvaluation.admin.response;

import java.util.List;

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
public class RequestPerDateResponse {
	String slot;
	
	List<DiamondRequestResponse> list;
}
