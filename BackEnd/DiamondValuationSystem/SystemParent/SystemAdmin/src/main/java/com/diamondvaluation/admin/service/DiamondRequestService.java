package com.diamondvaluation.admin.service;

import java.util.List;

import com.diamondvaluation.common.DiamondRequest;

import jakarta.servlet.http.HttpServletRequest;

public interface DiamondRequestService {

	void save(DiamondRequest diamondRequest, HttpServletRequest request);

	DiamondRequest getRequestById(Integer id);

	void deleteById(Integer id);

	List<DiamondRequest> findAllRequest();

}
