package com.diamondvaluation.shop.service;

import com.diamondvaluation.common.Customer;
import com.diamondvaluation.shop.request.CheckOutRequest;

public interface DiamondRequestService {
	void createDiamondRequest(CheckOutRequest request,Customer customer,boolean isPaid);
}
