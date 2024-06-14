package com.diamondvaluation.admin.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.User;
@Repository
public interface UserRepository extends CrudRepository<User, Integer>, PagingAndSortingRepository<User, Integer>{
	@Query("SELECT u FROM User u WHERE u.email = ?1")
	Optional<User> findByUsername(String username);
	
	@Query("SELECT u FROM User u WHERE CONCAT(u.id, ' ', u.email, ' ', u.firstName, ' ',"
			+ " u.lastName, ' ', u.phoneNumber) LIKE %?1%")
	Page<User> findAll(String keyword, Pageable pageable);
	
	@Query("SELECT u FROM User u WHERE u.id = :id AND u.password = :password")
    Optional<User> checkPasswordByUserId(@Param("id") Integer id, @Param("password") String password);
}
