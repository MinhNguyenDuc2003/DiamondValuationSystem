package com.diamondvaluation.admin.service;

import java.util.List;

import com.diamondvaluation.common.Report;

import jakarta.servlet.http.HttpServletRequest;

public interface ReportService {

	void saveReport(Report report, HttpServletRequest request);

	void deleteReportById(Integer id);

	List<Report> getAllReports();

	Report getReportById(Integer id);

}
