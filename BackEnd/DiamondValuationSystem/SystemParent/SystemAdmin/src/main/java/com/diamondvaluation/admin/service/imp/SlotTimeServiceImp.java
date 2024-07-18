package com.diamondvaluation.admin.service.imp;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.diamondvaluation.admin.exception.SlotTimeAlredyExistException;
import com.diamondvaluation.admin.repository.SlotTimeRepository;
import com.diamondvaluation.admin.service.SlotTimeService;
import com.diamondvaluation.common.SlotTime;

@Service
public class SlotTimeServiceImp implements SlotTimeService{
	private final SlotTimeRepository repo;

	public SlotTimeServiceImp(SlotTimeRepository repo) {
		this.repo = repo;
	}

	@Override
	public void save(SlotTime slotTime) {
		boolean isUpdate = slotTime.getId() != null && slotTime.getId()>0;
		List<SlotTime> list = repo.findByTime(slotTime.getTime());

		if(!isUpdate) {
			if(!list.isEmpty()) {
				throw new SlotTimeAlredyExistException("SlotTime already exist!");
			}
		}else {
			Optional<SlotTime> slot = repo.findById(slotTime.getId());
			if(!slot.isPresent()) {
				throw new SlotTimeAlredyExistException("SlotTime not found with id!");
			}
			if(!list.isEmpty()) {
				if(!slotTime.getTime().equals(slot.get().getTime())) {
					throw new SlotTimeAlredyExistException("SlotTime already exist!");
				}
			}
		}
		repo.save(slotTime);
	}

	@Override
	public void deleteById(int id) {
		Optional<SlotTime> slotTime = repo.findById(id);
		if(!slotTime.isPresent()) {
			throw new SlotTimeAlredyExistException("SlotTime already exist!");
		}
		repo.deleteById(id);
	}

	@Override
	public List<SlotTime> getAllSlot() {
		return (List<SlotTime>) repo.findAll();
	}
	
	
}
