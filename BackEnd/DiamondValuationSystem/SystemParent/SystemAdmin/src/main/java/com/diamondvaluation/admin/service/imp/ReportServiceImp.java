package com.diamondvaluation.admin.service.imp;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.diamondvaluation.admin.Utility;
import com.diamondvaluation.admin.exception.ReportNotFoundException;
import com.diamondvaluation.admin.exception.RequestNotFoundException;
import com.diamondvaluation.admin.repository.ReportRepository;
import com.diamondvaluation.admin.repository.ReportTrackingRepository;
import com.diamondvaluation.admin.service.ReportService;
import com.diamondvaluation.admin.service.UserService;
import com.diamondvaluation.common.Report;
import com.diamondvaluation.common.ReportTracking;
import com.diamondvaluation.common.User;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

@Service
public class ReportServiceImp implements ReportService {
	private final ReportRepository reportRepository;
	private final ReportTrackingRepository reportTrackingRepository;
	private final UserService userService;

	public ReportServiceImp(ReportRepository reportRepository, ReportTrackingRepository reportTrackingRepository,
			UserService userService) {
		this.reportRepository = reportRepository;
		this.reportTrackingRepository = reportTrackingRepository;
		this.userService = userService;
	}

	@Transactional
	@Override
	public void saveReport(Report report, HttpServletRequest request) {
		try {
			User user = Utility.getIdOfAuthenticatedUser(request, userService);
			ReportTracking track = new ReportTracking();
			track.setStatus(report.isStatus());
			track.setReport(report);
			track.setUpdatedBy(user);
			reportTrackingRepository.save(track);
			reportRepository.save(report);
		} catch (Exception e) {
			throw new RuntimeException("Error saving report: " + e.getMessage());
		}
	}

	@Override
	public void deleteReportById(Integer id) {
		if (!reportRepository.existsById(id)) {
			throw new ReportNotFoundException("Report not found with id " + id);
		}
		reportRepository.deleteById(id);
	}

	@Override
	public List<Report> getAllReports() {
		try {
			List<Report> reports = (List<Report>) reportRepository.findAll();
			return reports;
		} catch (Exception e) {
			throw new RuntimeException("Error retrieving all reports: " + e.getMessage(), e);
		}
	}

	@Override
	public Report getReportById(Integer id) {
		Optional<Report> report = reportRepository.findById(id);
		if (!report.isPresent()) {
			throw new RequestNotFoundException("Can not find any report with id: " + id);
		}
		return report.get();
	}

}
