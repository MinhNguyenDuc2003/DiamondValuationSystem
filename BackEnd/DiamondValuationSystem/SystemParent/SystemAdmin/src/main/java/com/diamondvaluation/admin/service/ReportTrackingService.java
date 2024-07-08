package com.diamondvaluation.admin.service;

import java.util.List;

import com.diamondvaluation.common.ReportTracking;

public interface ReportTrackingService {

	List<ReportTracking> getTrackingByReportId(Integer id);
	
	void deleteById(Integer id);
}
