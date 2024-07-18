package com.diamondvaluation.admin.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import java.util.Optional;

import com.diamondvaluation.common.DiamondRequest;
import com.diamondvaluation.common.RequestStatus;
import com.diamondvaluation.common.SlotTime;
import com.diamondvaluation.common.User;

import jakarta.servlet.http.HttpServletRequest;

public interface DiamondRequestService {

	void save(DiamondRequest diamondRequest, HttpServletRequest request);

	DiamondRequest getRequestById(Integer id);

	void deleteById(Integer id);

	List<DiamondRequest> findAllRequest();
	
	List<DiamondRequest> findRequestsByStatusSortedByCreatedDate(RequestStatus status);
    void updateRequestStatus(Integer id, RequestStatus status,  HttpServletRequest request);

    
    List<DiamondRequest> getRequestByCustomerId(Integer id);
    

 // New method to count requests by month
  


    List<DiamondRequest> getRequestByDateAndSlot(String date, Integer slotId);

	List<SlotTime> getSlotAvailableByDate(String date);

	
	
	//new
//	Map<String, Map<String, Object>> countRequestsByMonthWeekDayForYear(int year);
//	Map<String, Map<String, Object>> countRevenuesByMonthWeekDayForYear(int year);

	List<Object> countRequestsAndRevenueByDay(LocalDate date);

	List<Object> countRevenuesByMonthWeekForYear(int year);

	List<Object> countRequestsAndRevenueByDateRange(LocalDate startDate, LocalDate endDate);

	
	Optional<DiamondRequest> findById(Integer requestId);

	List<DiamondRequest> findAllRequestNewByUser(User user);
}
