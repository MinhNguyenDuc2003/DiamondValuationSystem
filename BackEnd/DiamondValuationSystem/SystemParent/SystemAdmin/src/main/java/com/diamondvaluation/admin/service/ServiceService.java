package com.diamondvaluation.admin.service;

import java.util.List;

import com.diamondvaluation.common.DiamondService;


public interface ServiceService {

	DiamondService save(DiamondService service);

	DiamondService getServiceById(Integer id);

	boolean deleteServiceById(Integer id);

	List<DiamondService> findAllService();

}
