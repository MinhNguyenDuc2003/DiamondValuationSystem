package com.diamondvaluation.shop.service;

import java.util.List;

import com.diamondvaluation.common.Customer;
import com.diamondvaluation.common.DiamondRequest;
import com.diamondvaluation.shop.request.CheckOutRequest;

public interface DiamondRequestService {
	void createDiamondRequest(CheckOutRequest request,Customer customer,boolean isPaid);
	
	void updatePayStatus(Integer id ,boolean status);
	
	List<DiamondRequest> getAllRequestByCustomerEmail(String email);
}
