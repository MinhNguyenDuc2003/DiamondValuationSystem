package com.diamondvaluation.admin.service.imp;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.diamondvaluation.admin.exception.ServiceNameIsAlreadyExistException;
import com.diamondvaluation.admin.exception.ServiceNotFoundException;
import com.diamondvaluation.admin.exception.UsernameNotFoundException;
import com.diamondvaluation.admin.repository.ServiceRepository;
import com.diamondvaluation.admin.service.ServiceService;
import com.diamondvaluation.common.DiamondService;
import com.diamondvaluation.common.User;


@Service
public class ServiceServiceImp implements ServiceService{
	private final ServiceRepository serviceRepo;
	

	public ServiceServiceImp(ServiceRepository serviceRepo) {
		this.serviceRepo = serviceRepo;
	}



	@Override
	public DiamondService save(DiamondService service) {
		try {
			return serviceRepo.save(service);
		} catch (Exception e) {
			throw new ServiceNameIsAlreadyExistException("Your service name is already exist!");
		}
	}



	@Override
	public DiamondService getServiceById(Integer id) {
		Optional<DiamondService> service = serviceRepo.findById(id);
		if(!service.isPresent()) {
			throw new ServiceNotFoundException("Service id is not exist");
		}
		return service.get();
	}



	@Override
	public boolean deleteServiceById(Integer id) {
		DiamondService service = getServiceById(id);
		serviceRepo.deleteById(id);
		return true;
	}



	@Override
	public List<DiamondService> findAllService() {
		return (List<DiamondService>) serviceRepo.findAll();
	}
	
}
