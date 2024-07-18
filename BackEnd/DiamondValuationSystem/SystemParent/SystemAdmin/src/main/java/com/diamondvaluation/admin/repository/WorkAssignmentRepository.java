package com.diamondvaluation.admin.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.diamondvaluation.common.WorkAssignment;

@Repository
public interface WorkAssignmentRepository extends CrudRepository<WorkAssignment, Integer>{
	
	@Query("SELECT w FROM WorkAssignment w WHERE w.user.id=?1 and date=?2")
	Optional<WorkAssignment> findByUserIdAndDate(Integer id, LocalDate date);
	
	@Query("SELECT w FROM WorkAssignment w WHERE date=?1")
	List<WorkAssignment> findAllByDate(LocalDate date);
	
	@Modifying
    @Transactional
	@Query("Update WorkAssignment w SET w.status = ?2 WHERE id=?1")
	void updateStatusById(Integer id, boolean status);
	
	@Query("SELECT wa FROM WorkAssignment wa LEFT JOIN FETCH wa.requests WHERE wa.user.id = ?1 AND wa.date = ?2 AND wa.status = true")
	Optional<WorkAssignment> findByUserIdAndDateAndOn(Integer user_id, LocalDate date);
	
	@Query("SELECT w FROM WorkAssignment w WHERE date=?1 AND w.status=true")
	List<WorkAssignment> findAllByDateAndOn(LocalDate date);
	
	@Query(value = "SELECT a.* FROM assignments a JOIN assignment_request ar ON a.id = ar.assignment_id JOIN diamond_request dr ON ar.request_id = dr.id WHERE ar.request_id=?1", nativeQuery = true)
	Optional<WorkAssignment> findByRequestId(Integer id);
}
