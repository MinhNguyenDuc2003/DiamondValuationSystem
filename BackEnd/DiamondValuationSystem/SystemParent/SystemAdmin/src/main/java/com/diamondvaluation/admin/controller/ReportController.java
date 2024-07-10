package com.diamondvaluation.admin.controller;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.admin.exception.ReportNotFoundException;
import com.diamondvaluation.admin.exception.RequestNotFoundException;
import com.diamondvaluation.admin.request.ReportRequest;
import com.diamondvaluation.admin.response.MessageResponse;
import com.diamondvaluation.admin.response.ReportResponse;
import com.diamondvaluation.admin.service.ReportService;
import com.diamondvaluation.common.DiamondRequest;
import com.diamondvaluation.common.Report;
import com.diamondvaluation.common.ReportStatus;
import com.diamondvaluation.common.ReportType;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

	private final ReportService reportService;
	private final ModelMapper modelMapper;

	@Autowired
	public ReportController(ReportService reportService, ModelMapper modelMapper) {
		this.reportService = reportService;
		this.modelMapper = modelMapper;
	}

	@PostMapping("report/save")
	public ResponseEntity<?> createReport(@RequestBody @Valid ReportRequest reportRequest, HttpServletRequest request) {
		try {

			Report report = request2Entity(reportRequest);
			reportService.saveReport(report, request);
			return new ResponseEntity<>(new MessageResponse("Report created successfully!"), HttpStatus.OK);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}
	
	private Report request2Entity(ReportRequest request) {
		Report report = modelMapper.map(request, Report.class);
		ReportType type = ReportType.valueOf(request.getType());
		report.setType(type);
		report.setStatus(ReportStatus.valueOf(request.getStatus()));
		report.setRequest(new DiamondRequest(request.getRequest_id()));
		return report;
	}

	@DeleteMapping("report/delete/{id}")
	public ResponseEntity<?> deleteReport(@PathVariable Integer id) {
		try {
			reportService.deleteReportById(id);
			return new ResponseEntity<>(new MessageResponse("Report deleted successfully!"), HttpStatus.OK);
		} catch (ReportNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		} catch (Exception e) {
return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	@GetMapping("all-report")
	public ResponseEntity<?> getAllReports() {
		List<Report> list = reportService.getAllReports();
		return new ResponseEntity(listEntity2Response(list), HttpStatus.OK);
	}

	@GetMapping("report/{id}")
	public ResponseEntity<?> getReportById(@PathVariable("id") Integer id) {
		try {
			return new ResponseEntity<ReportResponse>(entity2Response(reportService.getReportById(id)), HttpStatus.OK);
		} catch (RequestNotFoundException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	private List<ReportResponse> listEntity2Response(List<Report> list) {
		List<ReportResponse> response = (List<ReportResponse>) list.stream().map(s -> entity2Response(s)).toList();
		return response;
	}

	private ReportResponse entity2Response(Report report) {
		ReportResponse reportResponse = modelMapper.map(report, ReportResponse.class);
	    DiamondRequest diamondRequest = report.getRequest();
	    reportResponse.setRequest_id(diamondRequest.getId());
	    return reportResponse;
	}

}
