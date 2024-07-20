package com.diamondvaluation.admin.service;
import java.util.List;
import java.util.Map;

import com.diamondvaluation.common.User;
import com.diamondvaluation.common.diamond.DiamondCertificate;

public interface DiamondCertificateService {

	DiamondCertificate save(DiamondCertificate certificate);

	DiamondCertificate getCertificateById(Integer id);

	boolean deleteById(Integer id);

	List<DiamondCertificate> findAllCertificate();

	Integer findByRequestId(Integer id);

	List<DiamondCertificate> findAllCertificateByUser(User user);

	List<Object> countCertificatesByMonthForYear(int year);
	
	Map<Integer, Integer> countCertificateEachMonthByYear(int year);
	
	int totalByYear(int year);
}
