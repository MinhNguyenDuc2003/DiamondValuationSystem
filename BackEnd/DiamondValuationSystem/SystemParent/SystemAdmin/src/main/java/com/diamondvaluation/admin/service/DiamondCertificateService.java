package com.diamondvaluation.admin.service;
import java.util.List;

import com.diamondvaluation.common.diamond.DiamondCertificate;

public interface DiamondCertificateService {

	DiamondCertificate save(DiamondCertificate certificate);

	DiamondCertificate getCertificateById(Integer id);

	boolean deleteById(Integer id);

	List<DiamondCertificate> findAllCertificate();

}
