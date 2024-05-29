package com.diamondvaluation.admin.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.Appoinment;
@Repository
public interface AppoinmentRepository extends CrudRepository<Appoinment, Integer>, PagingAndSortingRepository<Appoinment, Integer>{

}
