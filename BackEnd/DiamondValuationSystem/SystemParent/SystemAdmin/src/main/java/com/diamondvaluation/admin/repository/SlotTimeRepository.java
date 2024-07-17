package com.diamondvaluation.admin.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.SlotTime;


@Repository
public interface SlotTimeRepository extends CrudRepository<SlotTime, Integer>{
	List<SlotTime> findByTime(String time);
	
	@Query("SELECT s FROM SlotTime s WHERE s.id = ?1")
	SlotTime getNumberById(Integer id);
}
