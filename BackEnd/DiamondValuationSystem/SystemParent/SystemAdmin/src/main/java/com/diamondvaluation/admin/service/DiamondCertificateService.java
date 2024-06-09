package com.diamondvaluation.admin.service;
import java.util.List;

import com.diamondvaluation.common.diamond.DiamondCertificate;

public interface DiamondCertificateService {

	void save(DiamondCertificate certificate);

	DiamondCertificate getCertificateById(Integer id);

	void deleteById(Integer id);

	List<DiamondCertificate> findAllCertificate();

}
