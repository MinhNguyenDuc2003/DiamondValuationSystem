package com.diamondvaluation.admin.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.Customer;

@Repository
public interface CustomerRepository extends CrudRepository<Customer, Integer>, PagingAndSortingRepository<Customer, Integer>{
	
	Optional<Customer> findByEmail(String email);
	
	@Query("SELECT c FROM Customer c WHERE CONCAT(c.id, ' ', c.email, ' ', c.firstName, ' ',"
			+ " c.lastName, ' ', c.location, ' ', c.phoneNumber) LIKE %?1%")
	Page<Customer> findAll(String keyword, Pageable pageable);
	
}
