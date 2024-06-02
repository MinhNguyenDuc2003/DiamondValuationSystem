package com.diamondvaluation.admin.service;

import com.diamondvaluation.common.diamond.DiamondCertificate;

public interface DiamondCertificateService {

	void save(DiamondCertificate certificate);

	DiamondCertificate getCertificateById(Integer id);

}
