package com.diamondvaluation.shop.service.ipl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.diamondvaluation.common.DiamondService;
import com.diamondvaluation.shop.repository.ServiceRepository;
import com.diamondvaluation.shop.service.DiamondServiceService;
@Service
public class DiamondServiceIpl implements DiamondServiceService{
	private final ServiceRepository serviceRepo;
	
	
	public DiamondServiceIpl(ServiceRepository serviceRepo) {
		this.serviceRepo = serviceRepo;
	}

	@Override
	public List<DiamondService> getAllService() {
		return serviceRepo.findAllServiceAvailable();
	}

}
