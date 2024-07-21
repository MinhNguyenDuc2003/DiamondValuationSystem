package com.diamondvaluation.admin.response;

import java.util.Map;

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
public class DailyRevenueResponse {
	private Map<String, Double> revenueEachDay;
	private Map<String, Integer>requestEachDay;
	private int totalRequest;
	private double totalRevenue;
}
