package com.diamondvaluation.shop.service.ipl;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.diamondvaluation.common.DiamondValuation;
import com.diamondvaluation.shop.exception.DiamondValuationNotFoundException;
import com.diamondvaluation.shop.repository.DiamondValuationRepository;
import com.diamondvaluation.shop.service.DiamondValuationService;
@Service
public class DiamondValuationImp implements DiamondValuationService{
	private final DiamondValuationRepository repo;

	public DiamondValuationImp(DiamondValuationRepository repo) {
		this.repo = repo;
	}


	@Override
	public DiamondValuation getById(Integer id) {
		Optional<DiamondValuation> diamond = repo.findById(id);
		if(!diamond.isPresent()) {
			throw new DiamondValuationNotFoundException("Cannot find any Diamond Valuation");
		}
		return diamond.get();
	}
	
	
}
