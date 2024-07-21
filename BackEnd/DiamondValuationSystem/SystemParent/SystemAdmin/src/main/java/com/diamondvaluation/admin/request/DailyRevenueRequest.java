package com.diamondvaluation.admin.request;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DailyRevenueRequest {
	private LocalDate beginDate;
	private LocalDate endDate;
}
