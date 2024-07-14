package com.diamondvaluation.admin.service;

import java.util.List;

import com.diamondvaluation.common.DiamondRequest;
import com.diamondvaluation.common.RequestStatus;
import com.diamondvaluation.common.SlotTime;

import jakarta.servlet.http.HttpServletRequest;

public interface DiamondRequestService {

	void save(DiamondRequest diamondRequest, HttpServletRequest request);

	DiamondRequest getRequestById(Integer id);

	void deleteById(Integer id);

	List<DiamondRequest> findAllRequest();
	
	List<DiamondRequest> findRequestsByStatusSortedByCreatedDate(RequestStatus status);
    void updateRequestStatus(Integer id, RequestStatus status,  HttpServletRequest request);

    
    List<DiamondRequest> getRequestByCustomerId(Integer id);
    
    List<DiamondRequest> getRequestByDateAndSlot(String date, Integer slotId);

	List<SlotTime> getSlotAvailableByDate(String date);
}
