package com.diamondvaluation.admin.service;

import com.diamondvaluation.admin.response.DashByYearResponse;

public interface DashBoardService {
	DashByYearResponse getDashBoardByYear(int year);
}
