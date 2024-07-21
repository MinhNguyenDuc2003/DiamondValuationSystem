package com.diamondvaluation.shop.service.ipl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.diamondvaluation.common.Customer;
import com.diamondvaluation.common.DiamondRequest;
import com.diamondvaluation.common.DiamondService;
import com.diamondvaluation.common.PaymentMethod;
import com.diamondvaluation.common.RequestStatus;
import com.diamondvaluation.shop.exception.CustomerNotFoundException;
import com.diamondvaluation.shop.exception.ServiceNotFoundException;
import com.diamondvaluation.shop.repository.CustomerRepository;
import com.diamondvaluation.shop.repository.DiamondRequestRepository;
import com.diamondvaluation.shop.repository.ServiceRepository;
import com.diamondvaluation.shop.request.CheckOutRequest;
import com.diamondvaluation.shop.service.DiamondRequestService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DiamondRequestServiceIpl implements DiamondRequestService{
	private final DiamondRequestRepository repo;
	private final CustomerRepository cusRepo;
	private final ServiceRepository serviceRepo;

	
	@Override
	public DiamondRequest createDiamondRequest(CheckOutRequest request, Customer customer, boolean isPaid) {
		DiamondRequest diamondRequest = new DiamondRequest();
		if(!cusRepo.existsById(customer.getId())) {
			throw new CustomerNotFoundException("Customer is not found");
		}
		diamondRequest.setCustomer(customer);
		diamondRequest.setMethod(PaymentMethod.valueOf(request.getPaymentMethod()));
		diamondRequest.setNote(request.getNote());
		diamondRequest.setPaid(isPaid);
		diamondRequest.setStatus(RequestStatus.WAIT);
		DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate date = LocalDate.parse(request.getDate(), dateFormatter);
        diamondRequest.setAppointmentDate(date);
		List<DiamondService> list = new ArrayList<>();
		double total = 0;
		for(String name : request.getServiceName()) {
			Optional<DiamondService> s = serviceRepo.findByName(name);
			if(!s.isPresent()) {
				throw new ServiceNotFoundException("Cannot find any service");
			}
			DiamondService service = s.get();
			total+= service.getMoney();
			list.add(service);
		}
		diamondRequest.setServices(list);
		diamondRequest.setPaymentTotal(total);
		if(diamondRequest.isPaid()) {
			diamondRequest.setPaidDate(LocalDate.now());
		}
		return repo.save(diamondRequest);
		
	}

	@Override
	public void updatePayStatus(Integer id, boolean status) {
		repo.updatePayStatus(id, status);
	}

	@Override
	public List<DiamondRequest> getAllRequestByCustomerEmail(String email) {
		Optional<Customer> customer = cusRepo.findByEmail(email);
		if(!customer.isPresent()) {
			throw new CustomerNotFoundException("Cannot find any customer with email:" + email);
		}
		return repo.findByCustomer(customer.get().getId());
	}

}
