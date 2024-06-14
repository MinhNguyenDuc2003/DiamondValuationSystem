package com.diamondvaluation.shop.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.AuthenticationType;
import com.diamondvaluation.common.Customer;

@Repository
public interface CustomerRepository extends CrudRepository<Customer, Integer>, PagingAndSortingRepository<Customer, Integer>{
	@Query("SELECT c FROM Customer c WHERE c.email = ?1 AND c.enabled = true")
	Optional<Customer> findByEmail(String email);
	
	@Query("SELECT c FROM Customer c WHERE c.email = ?1")
	Optional<Customer> findByEmailAll(String email);

	Optional<Customer> findByVerificationCode(String code);
	
	@Query("UPDATE Customer c SET c.enabled = true, c.verificationCode = null WHERE c.id = ?1")
	@Modifying
	void enable(Integer id);
	
	@Query("UPDATE Customer c SET c.authenticationType = ?2 WHERE c.id = ?1")
	@Modifying
	public void updateAuthenticationType(Integer customerId, AuthenticationType type);
	
}
