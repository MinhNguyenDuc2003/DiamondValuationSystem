package com.diamondvaluation.admin.service.imp;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.diamondvaluation.admin.Utility;
import com.diamondvaluation.admin.exception.CustomerNotFoundException;
import com.diamondvaluation.admin.exception.RequestNotFoundException;
import com.diamondvaluation.admin.exception.ServiceNotFoundException;
import com.diamondvaluation.admin.exception.SlotTimeIsAlreadyFull;
import com.diamondvaluation.admin.exception.SlotTimeNotFoundException;
import com.diamondvaluation.admin.repository.CustomerRepository;
import com.diamondvaluation.admin.repository.DiamondRequestRepository;
import com.diamondvaluation.admin.repository.RequestTrackRepository;
import com.diamondvaluation.admin.repository.ServiceRepository;
import com.diamondvaluation.admin.repository.SlotTimeRepository;
import com.diamondvaluation.admin.service.DiamondRequestService;
import com.diamondvaluation.admin.service.UserService;
import com.diamondvaluation.common.Customer;
import com.diamondvaluation.common.DiamondRequest;
import com.diamondvaluation.common.DiamondService;
import com.diamondvaluation.common.RequestStatus;
import com.diamondvaluation.common.RequestTrack;
import com.diamondvaluation.common.SlotTime;
import com.diamondvaluation.common.User;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

@Service
public class DiamondRequestServiceImp implements DiamondRequestService {
	private final DiamondRequestRepository repo;
	private final ServiceRepository serviceRepo;
	private final RequestTrackRepository trackingRepo;
	private final CustomerRepository cusRepo;
	private final UserService userService;
	private final SlotTimeRepository slotRepo;


	public DiamondRequestServiceImp(DiamondRequestRepository repo, ServiceRepository serviceRepo,
			RequestTrackRepository trackingRepo, CustomerRepository cusRepo, UserService userService,
			SlotTimeRepository slotRepo) {
		this.repo = repo;
		this.serviceRepo = serviceRepo;
		this.trackingRepo = trackingRepo;
		this.cusRepo = cusRepo;
		this.userService = userService;
		this.slotRepo = slotRepo;
	}

	@Transactional
	@Override
	public void save(DiamondRequest diamondRequest, HttpServletRequest request) {

		RequestTrack track = new RequestTrack();
		Date date = new Date();
		track.setUpdatedTime(date);
		User user = Utility.getIdOfAuthenticatedUser(request, userService);
		track.setUpdatedBy(user);
		track.setNote(diamondRequest.getNote());
		track.setRequest(diamondRequest);
		track.setStatus(diamondRequest.getStatus());
		if (diamondRequest.getId() != null) {
			Optional<DiamondRequest> appoinment = repo.findById(diamondRequest.getId());
			if (!appoinment.isPresent()) {
				throw new RequestNotFoundException("Can not find any appoinment with id: " + diamondRequest.getId());
			}
			diamondRequest.setCreatedDate(appoinment.get().getCreatedDate());
		}
		double money = 0.0;
		for (DiamondService service : diamondRequest.getServices()) {
			Optional<DiamondService> ds = serviceRepo.findById(service.getId());
			if (!ds.isPresent()) {
				throw new ServiceNotFoundException("Service is not exist!");
			}
			money += ds.get().getMoney();
		}
		diamondRequest.setPaymentTotal(money);
		Optional<SlotTime> slot = slotRepo.findById(diamondRequest.getSlot().getId());
		if(!slot.isPresent()) {
			throw new SlotTimeNotFoundException("Cannot find any slottime with id!");
		}
		diamondRequest.setSlot(slot.get());
		int numberRequestBySlotAndDate = repo.countRequestByDateAndSlot(diamondRequest.getAppointmentDate().toString(), diamondRequest.getSlot().getId());
		int numberLimit = slotRepo.getNumberById(diamondRequest.getSlot().getId()).getNumber();
		if(numberRequestBySlotAndDate>= numberLimit) {
			throw new SlotTimeIsAlreadyFull("Cannot add request in this time!");
		}
		trackingRepo.save(track);
		repo.save(diamondRequest);
	}

	@Override
	public DiamondRequest getRequestById(Integer id) {
		Optional<DiamondRequest> appoinment = repo.findById(id);
		if (!appoinment.isPresent()) {
			throw new RequestNotFoundException("Can not find any appoinment with id: " + id);
		}
		return appoinment.get();
	}

	@Override
	public void deleteById(Integer id) {
		Optional<DiamondRequest> appoinment = repo.findById(id);
		if (!appoinment.isPresent()) {
			throw new RequestNotFoundException("Can not find any appoinment with id: " + id);
		}
		repo.delete(appoinment.get());
	}

	@Override
	public List<DiamondRequest> findAllRequest() {
		return repo.findAllOrderByCreatedDateDesc();
	}

	public List<DiamondRequest> findRequestsByStatusSortedByCreatedDate(RequestStatus status) {
		return repo.findByStatusOrderByCreatedDateAsc(status);
	}

	@Transactional
	@Override
	public void updateRequestStatus(Integer id, RequestStatus status, HttpServletRequest request) {
		DiamondRequest diamondRequest = getRequestById(id);
		RequestTrack track = new RequestTrack();
		Date date = new Date();
		track.setUpdatedTime(date);
		User user = Utility.getIdOfAuthenticatedUser(request, userService);
		track.setUpdatedBy(user);
		track.setNote(diamondRequest.getNote());
		track.setRequest(diamondRequest);
		track.setStatus(diamondRequest.getStatus());
		diamondRequest.setStatus(status);
		repo.save(diamondRequest);
	}

	@Override
	public List<DiamondRequest> getRequestByCustomerId(Integer id) {
		Optional<Customer> customer = cusRepo.findById(id);
		if (!customer.isPresent()) {
			throw new CustomerNotFoundException("Cannot find any Customer with id" + id);
		}
		return repo.getDiamondRequestByCustomerId(id);
	}

	@Override
	public List<DiamondRequest> getRequestByDateAndSlot(String date, Integer slotId) {
		return repo.getRequestByDateAndSlotId(date, slotId);
	}

	@Override
	public List<SlotTime> getSlotAvailableByDate(String date) {
		List<SlotTime> listSlot = (List<SlotTime>) slotRepo.findAll();
		List<SlotTime> available = new ArrayList<>();
		for(SlotTime s : listSlot) {
			int limit = s.getNumber();
			int now = repo.countRequestByDateAndSlot(date, s.getId());
			if(now < limit) {
				available.add(s);
			}
		}
		return available;
	}

	@Override
	public Optional<DiamondRequest> findById(Integer requestId) {
		return repo.findById(requestId);
	}

	@Override
	public List<DiamondRequest> findAllRequestNewByUser(User user) {
		return repo.findAllRequestNewByUserId(user.getId());
	}

}
