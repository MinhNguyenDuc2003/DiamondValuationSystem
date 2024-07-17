package com.diamondvaluation.admin.service;

import java.util.List;

import com.diamondvaluation.common.RequestTrack;

public interface RequestTrackService {

	List<RequestTrack> getTrackingByRequestId(Integer id);
	
	void deleteById(Integer id);

}
