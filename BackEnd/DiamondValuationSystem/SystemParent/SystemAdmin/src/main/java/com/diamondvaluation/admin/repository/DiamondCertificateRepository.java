package com.diamondvaluation.admin.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.diamond.DiamondCertificate;


@Repository
public interface DiamondCertificateRepository extends CrudRepository<DiamondCertificate, Integer>{
	Optional<DiamondCertificate> findByCode(String code);
	
	@Query(value = "SELECT * FROM diamond_certificates d WHERE d.request_id = :requestId", nativeQuery = true)
    Optional<DiamondCertificate> findByRequestId(@Param("requestId") Integer requestId);
	
	@Query(value = "SELECT dc.*\n"
			+ "FROM diamond_certificates dc\n"
			+ "JOIN diamond_request dr ON dc.request_id = dr.id\n"
			+ "JOIN assignment_request ar ON dr.id = ar.request_id\n"
			+ "JOIN assignments ass ON ar.assignment_id = ass.id\n"
			+ "JOIN users u ON ass.user_id = u.id\n"
			+ "WHERE u.id = ?1 order by dc.created_date;", nativeQuery = true)
	List<DiamondCertificate> findAllCertificateByValuationStaffId(Integer id);
	
	int countByCreatedDateBetween(LocalDateTime start, LocalDateTime end);
	
	@Query(value = "SELECT COUNT(id) FROM diamond_certificates  d WHERE MONTH(created_date) = ?1", nativeQuery = true)
	int countCertificateByMonth(int i, int year);
	
	@Query(value = "SELECT COUNT(id) FROM diamond_certificates  d WHERE YEAR(created_date) = ?1", nativeQuery = true)
	int countCertificateByYear(int i);
	
	@Query(value = "SELECT * FROM diamond_certificates d order by d.created_date desc;", nativeQuery = true)
	List<DiamondCertificate> findAllCertificates();
}
