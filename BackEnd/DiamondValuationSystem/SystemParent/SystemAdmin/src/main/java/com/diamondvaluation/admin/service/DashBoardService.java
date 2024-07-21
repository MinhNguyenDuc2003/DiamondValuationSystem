package com.diamondvaluation.admin.service;

import java.time.LocalDate;

import com.diamondvaluation.admin.response.DailyRevenueResponse;
import com.diamondvaluation.admin.response.DashByYearResponse;

public interface DashBoardService {
	DashByYearResponse getDashBoardByYear(int year);
	
	DailyRevenueResponse getDailyResponse(LocalDate begin, LocalDate end);
}
