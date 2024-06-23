package com.diamondvaluation.admin.service.imp;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.diamondvaluation.admin.Utility;
import com.diamondvaluation.admin.exception.RequestNotFoundException;
import com.diamondvaluation.admin.exception.ServiceNotFoundException;
import com.diamondvaluation.admin.repository.DiamondRequestRepository;
import com.diamondvaluation.admin.repository.RequestTrackRepository;
import com.diamondvaluation.admin.repository.ServiceRepository;
import com.diamondvaluation.admin.service.DiamondRequestService;
import com.diamondvaluation.common.DiamondRequest;
import com.diamondvaluation.common.RequestStatus;
import com.diamondvaluation.common.DiamondService;
import com.diamondvaluation.common.RequestTrack;
import com.diamondvaluation.common.User;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

@Service
public class DiamondRequestServiceImp implements DiamondRequestService{
	private final DiamondRequestRepository repo;
	private final ServiceRepository serviceRepo;
	private final RequestTrackRepository trackingRepo;
	

	public DiamondRequestServiceImp(DiamondRequestRepository repo, RequestTrackRepository trackingRepo,
			ServiceRepository serviceRepo) {
		this.repo = repo;
		this.trackingRepo = trackingRepo;
		this.serviceRepo = serviceRepo;
	}

	@Transactional
	@Override
	public void save(DiamondRequest diamondRequest, HttpServletRequest request) {
		
		RequestTrack track = new RequestTrack();
		Date date = new Date();
		track.setUpdatedTime(date);
		User user = Utility.getIdOfAuthenticatedUser(request);
		track.setUpdatedBy(user);
		track.setNote(diamondRequest.getNote());
		track.setRequest(diamondRequest);
		track.setStatus(diamondRequest.getStatus());
		if(diamondRequest.getId() != null) {
			Optional<DiamondRequest> appoinment = repo.findById(diamondRequest.getId());
			if(!appoinment.isPresent()) {
				throw new RequestNotFoundException("Can not find any appoinment with id: " + diamondRequest.getId());
			}
			diamondRequest.setCreatedDate(appoinment.get().getCreatedDate());
		}
		double money = 0.0;
		for(DiamondService service : diamondRequest.getServices()) {
			Optional<DiamondService> ds = serviceRepo.findById(service.getId());
			if(!ds.isPresent()) {
				throw new ServiceNotFoundException("Service is not exist!");
			}
			money += ds.get().getMoney();
		}
		diamondRequest.setPaymentTotal(money);
		trackingRepo.save(track);
		repo.save(diamondRequest);
	}



	@Override
	public DiamondRequest getRequestById(Integer id) {
		Optional<DiamondRequest> appoinment = repo.findById(id);
		if(!appoinment.isPresent()) {
			throw new RequestNotFoundException("Can not find any appoinment with id: " + id);
		}
		return appoinment.get();
	}



	@Override
	public void deleteById(Integer id) {
		Optional<DiamondRequest> appoinment = repo.findById(id);
		if(!appoinment.isPresent()) {
			throw new RequestNotFoundException("Can not find any appoinment with id: " + id);
		}
		repo.delete(appoinment.get());
	}



	@Override
	public List<DiamondRequest> findAllRequest() {
		return (List<DiamondRequest>) repo.findAll();
	}
	
	
	public List<DiamondRequest> findRequestsByStatusSortedByCreatedDate(RequestStatus status) {
        return repo.findByStatusOrderByCreatedDateAsc(status);
    }

    @Transactional
    @Override
    public void updateRequestStatus(Integer id, RequestStatus status) {
        DiamondRequest request = getRequestById(id);
        request.setStatus(status);
        repo.save(request);
    }

}
