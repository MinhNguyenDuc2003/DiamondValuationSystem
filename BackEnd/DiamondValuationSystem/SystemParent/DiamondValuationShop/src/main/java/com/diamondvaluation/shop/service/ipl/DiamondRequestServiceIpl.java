package com.diamondvaluation.shop.service.ipl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.diamondvaluation.common.Customer;
import com.diamondvaluation.common.DiamondRequest;
import com.diamondvaluation.common.DiamondService;
import com.diamondvaluation.common.PaymentMethod;
import com.diamondvaluation.common.RequestStatus;
import com.diamondvaluation.shop.exception.CustomerNotFoundException;
import com.diamondvaluation.shop.repository.CustomerRepository;
import com.diamondvaluation.shop.repository.DiamondRequestRepository;
import com.diamondvaluation.shop.request.CheckOutRequest;
import com.diamondvaluation.shop.service.DiamondRequestService;

@Service
public class DiamondRequestServiceIpl implements DiamondRequestService{
	private final DiamondRequestRepository repo;
	private final CustomerRepository cusRepo;
	
	public DiamondRequestServiceIpl(DiamondRequestRepository repo, CustomerRepository cusRepo) {
		this.repo = repo;
		this.cusRepo = cusRepo;
	}

	@Override
	public void createDiamondRequest(CheckOutRequest request, Customer customer, boolean isPaid) {
		DiamondRequest diamondRequest = new DiamondRequest();
		if(!cusRepo.existsById(customer.getId())) {
			throw new CustomerNotFoundException("Customer is not found");
		}
		diamondRequest.setCustomer(customer);
		diamondRequest.setMethod(PaymentMethod.valueOf(request.getPayment_method()));
		diamondRequest.setNote(request.getNote());
		diamondRequest.setPaid(isPaid);
		diamondRequest.setStatus(RequestStatus.WAIT);
		List<DiamondService> list = new ArrayList<>();
		for(String id : request.getServiceId()) {
			DiamondService s = new DiamondService(Integer.parseInt(id));
			list.add(s);
		}
		diamondRequest.setServices(list);
		repo.save(diamondRequest);
		
	}

}
