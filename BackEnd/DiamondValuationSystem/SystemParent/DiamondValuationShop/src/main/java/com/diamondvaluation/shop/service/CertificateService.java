package com.diamondvaluation.shop.service;

import com.diamondvaluation.common.diamond.DiamondCertificate;

public interface CertificateService {

	Integer findByRequestId(Integer id);
	
	DiamondCertificate findByCode(String code);
	
	DiamondCertificate findById(Integer id);

}
