package com.diamondvaluation.admin.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.ReportTracking;

@Repository
public interface ReportTrackingRepository extends CrudRepository<ReportTracking, Integer>{
	@Query("SELECT r FROM ReportTracking r WHERE r.report.id = ?1")
	List<ReportTracking> findAllByReportId(Integer id);
	
}
