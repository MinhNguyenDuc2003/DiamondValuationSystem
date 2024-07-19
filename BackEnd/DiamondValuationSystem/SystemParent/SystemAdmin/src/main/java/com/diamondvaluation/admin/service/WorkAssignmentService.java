package com.diamondvaluation.admin.service;

import java.time.LocalDate;
import java.util.List;

import com.diamondvaluation.admin.request.ValuationStaffAssignmentRequest;
import com.diamondvaluation.admin.response.AssignmentResponse;
import com.diamondvaluation.admin.response.ValuationStaffAssignmentResponse;
import com.diamondvaluation.common.WorkAssignment;

import jakarta.validation.Valid;

public interface WorkAssignmentService {

	void save(WorkAssignment request2Entity);

	List<AssignmentResponse> getAllByDate(LocalDate date);

	void updateStatus(Integer id, boolean status);

	void deleteById(Integer id);
	
	void findByUserIdAndDate(Integer id, LocalDate date);

	void setStaffToRequest(@Valid ValuationStaffAssignmentRequest request);

	List<ValuationStaffAssignmentResponse> getAllValuationStaffAvailable(LocalDate date);
	
	List<WorkAssignment> findByRequestId(Integer id);

	void deleteRequestAndStaff(@Valid ValuationStaffAssignmentRequest request);
	
}
