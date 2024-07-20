package com.diamondvaluation.admin.service.imp;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.diamondvaluation.admin.response.DashByYearResponse;
import com.diamondvaluation.admin.service.CustomerService;
import com.diamondvaluation.admin.service.DashBoardService;
import com.diamondvaluation.admin.service.DiamondCertificateService;
import com.diamondvaluation.admin.service.DiamondRequestService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashBoardServiceImp implements DashBoardService{
	private final CustomerService cusService;
	private final DiamondRequestService requestService;
	private final DiamondCertificateService cerService;
	
	@Override
	public DashByYearResponse getDashBoardByYear(int year) {
		DashByYearResponse dash = new DashByYearResponse(); 
		Map<Integer, Integer> numberCustomerEachMonth = cusService.countCustomerEachMonthByYear(year);
		dash.setNumberCustomerEachMonth(numberCustomerEachMonth);
		Map<Integer, Integer> numberRequestEachMonth = requestService.countRequestEachMonthByYear(year);
		dash.setNumberRequestEachMonth(numberRequestEachMonth);
		Map<Integer, Integer> numberCertificateEachMonth = cerService.countCertificateEachMonthByYear(year);
		dash.setNumberCertificateEachMonth(numberCertificateEachMonth);
		Map<Integer, Double> revenueEachMonth = requestService.revenueRequestEachMonthByYear(year);
		dash.setRevenueEachMonth(revenueEachMonth);
		int totalCustomer = cusService.totalCustomerByYear(year);
		dash.setTotalCustomer(totalCustomer);
		int totalRequest = requestService.totalRequestByYear(year);
		dash.setTotalRequest(totalRequest);
		double totalRevenue = requestService.revenueByYear(year);
		dash.setTotalRevenue(totalRevenue);
		int totalCertificate = cerService.totalByYear(year);
		dash.setTotalCertificate(totalCertificate);
		return dash;
	}
	
}
