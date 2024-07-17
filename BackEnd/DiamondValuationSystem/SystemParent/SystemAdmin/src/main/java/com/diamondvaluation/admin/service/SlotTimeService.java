package com.diamondvaluation.admin.service;

import java.util.List;

import com.diamondvaluation.common.SlotTime;

public interface SlotTimeService {

	void save(SlotTime slotTime);

	void deleteById(int id);

	List<SlotTime> getAllSlot();
	
}
