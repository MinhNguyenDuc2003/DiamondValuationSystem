package com.diamondvaluation.admin.service.imp;

import org.springframework.stereotype.Service;

import com.diamondvaluation.admin.repository.AppoinmentRepository;
import com.diamondvaluation.admin.service.AppoinmentService;
import com.diamondvaluation.common.Appoinment;

@Service
public class AppoinmentServiceImp implements AppoinmentService{
	private final AppoinmentRepository repo;
	
	

	public AppoinmentServiceImp(AppoinmentRepository repo) {
		this.repo = repo;
	}



	@Override
	public void save(Appoinment appoinment) {
		repo.save(appoinment);
		
	}

}
