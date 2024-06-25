package com.diamondvaluation.admin.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DiamondPrice {
	private double price;
	private double min;
	private double max;
	private double avg;
	private int count;
	private String link;
}
