package com.diamondvaluation.admin.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.admin.exception.CustomerNotFoundException;
import com.diamondvaluation.admin.exception.RequestNotFoundException;
import com.diamondvaluation.admin.exception.SlotTimeIsAlreadyFull;
import com.diamondvaluation.admin.exception.SlotTimeNotFoundException;
import com.diamondvaluation.admin.request.DiamondRequestRequest;
import com.diamondvaluation.admin.response.DiamondRequestResponse;
import com.diamondvaluation.admin.response.MessageResponse;
import com.diamondvaluation.admin.response.RequestPerDateResponse;
import com.diamondvaluation.admin.service.DiamondCertificateService;
import com.diamondvaluation.admin.service.DiamondRequestService;
import com.diamondvaluation.admin.service.SlotTimeService;
import com.diamondvaluation.common.Customer;
import com.diamondvaluation.common.DiamondRequest;
import com.diamondvaluation.common.DiamondService;
import com.diamondvaluation.common.RequestStatus;
import com.diamondvaluation.common.SlotTime;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/diamond-requests/")
public class DiamondRequestController {
	private final DiamondCertificateService certificateService;
	private final DiamondRequestService requestService;
	private final SlotTimeService slotService;
	private final ModelMapper modelMapper;

	public DiamondRequestController(DiamondCertificateService certificateService, DiamondRequestService requestService,
			SlotTimeService slotService, ModelMapper modelMapper) {
		this.certificateService = certificateService;
		this.requestService = requestService;
		this.slotService = slotService;
		this.modelMapper = modelMapper;
	}

	@PostMapping("request/save")
	public ResponseEntity<?> addNewRequest(@ModelAttribute @Valid DiamondRequestRequest appoinmentRequest,
			HttpServletRequest request) {
		try {
			DiamondRequest appoinment = request2Entity(appoinmentRequest);
			requestService.save(appoinment, request);

			return new ResponseEntity<>(new MessageResponse("Add/Update Appoinment successfully!"), HttpStatus.OK);
		} catch (SlotTimeNotFoundException e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		} catch (SlotTimeIsAlreadyFull e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}

	private DiamondRequest request2Entity(DiamondRequestRequest request) {
		DiamondRequest appoinment = modelMapper.map(request, DiamondRequest.class);
		Customer customer = new Customer(request.getCustomer_id());
		appoinment.setCustomer(customer);
		List<String> services = request.getService_ids();
		List<DiamondService> list = new ArrayList<>();
		for (String id : services) {
			DiamondService service = new DiamondService(Integer.parseInt(id));
			list.add(service);
		}

		RequestStatus status = RequestStatus.valueOf(request.getStatus());
		appoinment.setStatus(status);
		appoinment.setServices(list);
		appoinment.setMethod(request.getPayment_method());
		appoinment.setPaid(request.isPaid());
		if (request.getAppointmentDate() != null && request.getAppointmentDate().toString().length() > 0) {
			DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
			LocalDate date = LocalDate.parse(request.getAppointmentDate(), dateFormatter);
			appoinment.setAppointmentDate(date);
		}
		SlotTime slotTime = new SlotTime(Integer.parseInt(request.getSlotId()));
		appoinment.setSlot(slotTime);
		return appoinment;
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
		appoinmentResponse.setCertificate_id(certificateService.findByRequestId(appoinment.getId()));
		appoinmentResponse.setCustomer_email(appoinment.getCustomer().getEmail());
		appoinmentResponse.setSlot(appoinment.getSlot().getTime());
		appoinmentResponse.setSlotId(appoinment.getSlot().getId());
		return appoinmentResponse;
	}

	private List<DiamondRequestResponse> listEntity2Response(List<DiamondRequest> list) {
		List<DiamondRequestResponse> response = (List<DiamondRequestResponse>) list.stream()
				.map(s -> entity2Response(s)).toList();
		return response;
	}

	@GetMapping("request/{id}")
	public ResponseEntity<?> getReqeustById(@PathVariable("id") Integer id) {
		try {
			return new ResponseEntity<DiamondRequestResponse>(entity2Response(requestService.getRequestById(id)),
					HttpStatus.OK);
		} catch (RequestNotFoundException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@DeleteMapping("delete/{id}")
	public ResponseEntity<?> deleteRequestById(@PathVariable("id") Integer id) {
		try {
			requestService.deleteById(id);
			return new ResponseEntity<>(new MessageResponse("Delete Request successfully with id " + id),
					HttpStatus.OK);
		} catch (RequestNotFoundException e) {
			return ResponseEntity.status(HttpStatus.OK).body(e.getMessage());
		}
	}

	@GetMapping("all-request")
	public ResponseEntity<?> getAllRequest() {
		List<DiamondRequest> list = requestService.findAllRequest();
		return new ResponseEntity(listEntity2Response(list), HttpStatus.OK);
	}

	@GetMapping("requests/status/{status}")
    public ResponseEntity<?> getRequestsWithStatusNewSortedByCreatedDate(@PathVariable("status") String status) {

        List<DiamondRequest> list = requestService.findRequestsByStatusSortedByCreatedDate(RequestStatus.valueOf(status.toUpperCase()));
        return new ResponseEntity<>(listEntity2Response(list), HttpStatus.OK);
    }

	@PutMapping("request/update-status/{id}/{status}")
	public ResponseEntity<?> updateRequestStatus(@PathVariable("id") Integer id,
			@PathVariable("status") RequestStatus status, HttpServletRequest request) {
		try {
			requestService.updateRequestStatus(id, status, request);
			return new ResponseEntity<>(new MessageResponse("Status updated successfully for request id " + id),
					HttpStatus.OK);
		} catch (RequestNotFoundException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@GetMapping("/customer/{id}")
	public ResponseEntity<?> getRequestByCustomerId(@PathVariable("id") Integer id) {
		try {
			List<DiamondRequest> list = requestService.getRequestByCustomerId(id);
			return new ResponseEntity<>(listEntity2Response(list), HttpStatus.OK);
		} catch (CustomerNotFoundException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@GetMapping("request/date")
	public ResponseEntity<?> getRequestByDate(@RequestParam("date") String date){
		try {
			List<SlotTime> slotTime = slotService.getAllSlot();
			List<RequestPerDateResponse> list = new ArrayList<>();
			for(SlotTime s : slotTime) {
				RequestPerDateResponse response = new RequestPerDateResponse();
				response.setSlot(s.getTime());
				response.setList(listEntity2Response(requestService.getRequestByDateAndSlot(date, s.getId())));
				list.add(response);
			}
			return new ResponseEntity<>(list, HttpStatus.OK);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@GetMapping("request/slot-available")
	public ResponseEntity<?> getSlotAvailableByDate(@RequestParam("date") String date){
		try {
			List<SlotTime> list = requestService.getSlotAvailableByDate(date);
			return new ResponseEntity<>(list, HttpStatus.OK);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

}
