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
public class DashByYearResponse {
	private Map<Integer, Integer> numberCustomerEachMonth;
	private Map<Integer, Integer> numberRequestEachMonth;
	private Map<Integer, Integer> numberCertificateEachMonth;
	private Map<Integer, Double> revenueEachMonth;
	private int totalRequest;
	private int totalCustomer;
	private int totalCertificate;
	private double totalRevenue;
}
