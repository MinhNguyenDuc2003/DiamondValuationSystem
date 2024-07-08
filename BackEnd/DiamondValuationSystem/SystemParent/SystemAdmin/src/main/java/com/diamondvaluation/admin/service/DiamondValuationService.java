package com.diamondvaluation.admin.service;

import com.diamondvaluation.common.DiamondValuation;
import com.diamondvaluation.common.diamond.DiamondCertificate;

public interface DiamondValuationService {
	DiamondValuation save(DiamondCertificate certificate);
	DiamondValuation getById(Integer id);
	void deleteAllValuation();
}
