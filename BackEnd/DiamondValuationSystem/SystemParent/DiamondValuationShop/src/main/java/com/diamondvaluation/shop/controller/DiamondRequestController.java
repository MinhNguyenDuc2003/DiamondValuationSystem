package com.diamondvaluation.shop.controller;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.common.Customer;
import com.diamondvaluation.common.DiamondRequest;
import com.diamondvaluation.shop.Utility;
import com.diamondvaluation.shop.exception.CustomerNotFoundException;
import com.diamondvaluation.shop.response.DiamondRequestResponse;
import com.diamondvaluation.shop.service.CertificateService;
import com.diamondvaluation.shop.service.DiamondRequestService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/diamond-request")
public class DiamondRequestController {
	private final DiamondRequestService service;
	private final ModelMapper modelMapper;
	private final CertificateService cerService;

	public DiamondRequestController(DiamondRequestService service, ModelMapper modelMapper,
			CertificateService cerService) {
		this.service = service;
		this.modelMapper = modelMapper;
		this.cerService = cerService;
	}

	@GetMapping("/all")
	public ResponseEntity<?> getAllRequests(HttpServletRequest request) {
		try {
			String email = Utility.getEmailOfAuthenticatedCustomer(request);
			List<DiamondRequest> list = service.getAllRequestByCustomerEmail(email);
			return ResponseEntity.ok(listEntity2Response(list));
		} catch (CustomerNotFoundException e) {
			return ResponseEntity.badRequest().build();
		}
	}

	private DiamondRequestResponse entity2Response(DiamondRequest appoinment) {
		DiamondRequestResponse appoinmentResponse = modelMapper.map(appoinment, DiamondRequestResponse.class);
		Customer customer = appoinment.getCustomer();
		appoinmentResponse.setCustomerName(customer.getFullname());
		appoinmentResponse.setCustomerId(customer.getId());
		appoinmentResponse.setCustomerPhone(customer.getPhoneNumber());
		appoinmentResponse.setService_ids(appoinment.getServiceIds());
		appoinmentResponse.setService_names(appoinment.getServiceNames());
		appoinmentResponse.setCreatedDate(appoinment.getCreatedDate().toString());
		appoinmentResponse.setPaid(appoinment.isPaid());
		appoinmentResponse.setPayment_method(appoinment.getMethod() + "");
		appoinmentResponse.setTotal(appoinment.getPaymentTotal());
		if (appoinment.getAppointmentDate() != null) {
			appoinmentResponse.setAppoinment_date(appoinment.getAppointmentDate().toString());
		}
		if(appoinment.getSlot()!=null) {
			appoinmentResponse.setSlot(appoinment.getSlot().getTime());
		}
		appoinmentResponse.setCertificate_id(cerService.findByRequestId(appoinment.getId()));
		appoinmentResponse.setCustomer_email(appoinment.getCustomer().getEmail());
		return appoinmentResponse;
	}

	private List<DiamondRequestResponse> listEntity2Response(List<DiamondRequest> list) {
		List<DiamondRequestResponse> response = (List<DiamondRequestResponse>) list.stream()
				.map(s -> entity2Response(s)).toList();
		return response;
	}
}
