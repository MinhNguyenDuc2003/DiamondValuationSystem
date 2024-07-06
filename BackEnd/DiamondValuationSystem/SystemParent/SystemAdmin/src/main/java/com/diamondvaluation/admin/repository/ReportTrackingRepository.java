package com.diamondvaluation.admin.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.ReportTracking;

@Repository
public interface ReportTrackingRepository extends CrudRepository<ReportTracking, Integer>{
	
}
