package com.diamondvaluation.shop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.Customer;
import com.diamondvaluation.common.DiamondRequest;


@Repository
public interface DiamondRequestRepository extends CrudRepository<DiamondRequest, Integer>{
	@Query("UPDATE DiamondRequest d SET d.isPaid = ?2 WHERE d.id = ?1")
	void updatePayStatus(Integer id ,boolean status);
	
	@Query(value = "SELECT * FROM diamond_request d WHERE d.customer_id = ?1 ORDER BY d.created_date DESC", nativeQuery = true)
	List<DiamondRequest> findByCustomer(Integer id);
}
