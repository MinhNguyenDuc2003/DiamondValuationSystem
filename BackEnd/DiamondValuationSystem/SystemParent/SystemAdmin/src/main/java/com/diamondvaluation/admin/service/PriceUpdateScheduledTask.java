package com.diamondvaluation.admin.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.diamondvaluation.common.DiamondValuation;
import com.diamondvaluation.common.diamond.DiamondCertificate;

@Component
@EnableScheduling
public class PriceUpdateScheduledTask {
private static final Logger LOGGER = LoggerFactory.getLogger(PriceUpdateScheduledTask.class);
	
	@Autowired DiamondCertificateService cerService;
	@Autowired DiamondValuationService valuationService;
	
	
	@Scheduled(fixedDelayString = "${app.update-price.interval}", initialDelay = 5000)
	@Transactional
	public void updateValuationPrice() {
		List<DiamondCertificate> listCer = cerService.findAllCertificate();
		int total = 0;
		for(DiamondCertificate certificate : listCer) {
			Integer valuationId = certificate.getValuation().getId();
			DiamondValuation valuation = valuationService.save(certificate);
			certificate.setValuation(valuation);
			valuationService.deletebyId(valuationId);
			total++;
		}
		LOGGER.info("Number of update price: " + total);
		
	}
}
