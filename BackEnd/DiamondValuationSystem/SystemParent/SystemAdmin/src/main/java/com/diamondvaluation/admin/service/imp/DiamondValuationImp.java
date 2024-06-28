package com.diamondvaluation.admin.service.imp;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.diamondvaluation.admin.exception.DiamondValuationNotFoundException;
import com.diamondvaluation.admin.repository.DiamondValuationRepository;
import com.diamondvaluation.admin.request.DiamondPrice;
import com.diamondvaluation.admin.service.DiamondPriceService;
import com.diamondvaluation.admin.service.DiamondValuationService;
import com.diamondvaluation.admin.service.rapaport.AttributeService;
import com.diamondvaluation.common.DiamondValuation;
import com.diamondvaluation.common.diamond.DiamondCertificate;
@Service
public class DiamondValuationImp implements DiamondValuationService{
	private final DiamondValuationRepository repo;
	private final DiamondPriceService priceService;
	private final AttributeService aService;

	public DiamondValuationImp(DiamondValuationRepository repo, DiamondPriceService priceService,
			AttributeService aService) {
		this.repo = repo;
		this.priceService = priceService;
		this.aService = aService;
	}

	private double calculateRapPrice(DiamondCertificate certificate) {
		return aService.findNumberBy4C(certificate.getCarat(), certificate.getColor(), certificate.getClarity())*100*certificate.getCarat();
	}

	@Override
	public DiamondValuation save(DiamondCertificate certificate) {
		DiamondPrice price = priceService.getDiamondPrice(certificate);
		if(price !=null) {
			DiamondValuation valuation = new DiamondValuation();
			valuation.setMaxPrice(price.getMax());
			valuation.setMinPrice(price.getPrice());
			valuation.setRealPrice(price.getPrice());
			valuation.setRapPrice(calculateRapPrice(certificate));
			if(valuation.getRealPrice()>0 && valuation.getRapPrice()>0) {
				valuation.setRapPercent((valuation.getRapPrice()-valuation.getRealPrice())/valuation.getRapPrice()*100*(-1));
			}
			return repo.save(valuation);
		}
		return null;
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
