package com.diamondvaluation.admin.service.imp;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.diamondvaluation.admin.exception.ReportNotFoundException;
import com.diamondvaluation.admin.exception.ReportTrackingNotFoundException;
import com.diamondvaluation.admin.repository.ReportRepository;
import com.diamondvaluation.admin.repository.ReportTrackingRepository;
import com.diamondvaluation.admin.service.ReportTrackingService;
import com.diamondvaluation.common.Report;
import com.diamondvaluation.common.ReportTracking;

@Service
public class ReportTrackingServiceImp implements ReportTrackingService {
	private final ReportTrackingRepository repo;
	private final ReportRepository reportRepo;

	public ReportTrackingServiceImp(ReportTrackingRepository repo, ReportRepository reportRepo) {
		this.repo = repo;
		this.reportRepo = reportRepo;
	}

	@Override
	public List<ReportTracking> getTrackingByReportId(Integer id) {
		Optional<Report> report = reportRepo.findById(id);
		if(!report.isPresent()) {
			throw new ReportNotFoundException("Cannot find any Report with id " + id);
		}
		List<ReportTracking> list = repo.findAllByReportId(id);
 		return list;
	}

	@Override
	public void deleteById(Integer id) {
		Optional<ReportTracking> track = repo.findById(id);
		if(!track.isPresent()) {
			throw new ReportTrackingNotFoundException("Cannot find any tracking with id" + id);
		}
		repo.deleteById(id);
	}

}
