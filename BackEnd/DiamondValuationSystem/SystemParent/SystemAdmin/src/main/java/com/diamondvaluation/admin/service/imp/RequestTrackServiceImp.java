package com.diamondvaluation.admin.service.imp;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.diamondvaluation.admin.exception.RequestNotFoundException;
import com.diamondvaluation.admin.exception.RequestTrackingNotFoundException;
import com.diamondvaluation.admin.repository.DiamondRequestRepository;
import com.diamondvaluation.admin.repository.RequestTrackRepository;
import com.diamondvaluation.admin.service.RequestTrackService;
import com.diamondvaluation.common.DiamondRequest;
import com.diamondvaluation.common.RequestTrack;

@Service
public class RequestTrackServiceImp implements RequestTrackService {
	private final RequestTrackRepository repo;
	private final DiamondRequestRepository requestRepo;

	public RequestTrackServiceImp(RequestTrackRepository repo, DiamondRequestRepository requestRepo) {
		this.repo = repo;
		this.requestRepo = requestRepo;
	}

	@Override
	public List<RequestTrack> getTrackingByRequestId(Integer id) {
		Optional<DiamondRequest> request = requestRepo.findById(id);
		if(!request.isPresent()) {
			throw new RequestNotFoundException("Cannot find any request with id : " +id);
		}
		List<RequestTrack> list = repo.findTrackByRequestId(id);
		return list;
	}

	@Override
	public void deleteById(Integer id) {
		Optional<RequestTrack> track = repo.findById(id);
		if(!track.isPresent()) {
			throw new RequestTrackingNotFoundException("Cannot find any tracking with id" + id);
		}
		repo.deleteById(id);
		
	}

}
