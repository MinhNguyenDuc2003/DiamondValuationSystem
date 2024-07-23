package com.diamondvaluation.admin.repository;


import java.time.LocalDateTime;

import java.util.List;

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
	

	//new
	int countByCreatedTimeBetween(LocalDateTime start, LocalDateTime end);


	@Query("SELECT c FROM Customer c WHERE CONCAT(c.email, ' ', c.firstName, ' ',"
			+ " c.lastName, ' ', c.phoneNumber) LIKE %?1%")
	List<Customer> findAllByKeyword(String keyword);
	
	@Query(value = "SELECT COUNT(id) FROM customers c WHERE MONTH(created_time) = ?1", nativeQuery = true)
	int countCustomerByMonth(int i, int year);
	
	@Query(value = "SELECT COUNT(id) FROM customers c WHERE YEAR(created_time) = ?1", nativeQuery = true)
	int countCustomerByYear(int year);
	

}
