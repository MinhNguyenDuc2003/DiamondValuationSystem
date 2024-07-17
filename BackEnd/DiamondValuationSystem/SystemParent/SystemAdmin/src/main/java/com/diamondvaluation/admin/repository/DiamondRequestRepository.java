package com.diamondvaluation.admin.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.DiamondRequest;
import com.diamondvaluation.common.RequestStatus;
@Repository
public interface DiamondRequestRepository extends CrudRepository<DiamondRequest, Integer>, PagingAndSortingRepository<DiamondRequest, Integer>{
	List<DiamondRequest> findByStatusOrderByCreatedDateAsc(RequestStatus status);
    Optional<DiamondRequest> findByStatus(RequestStatus status);
    @Query(value = "SELECT * FROM diamond_request d WHERE d.customer_id = :id ORDER BY d.created_date DESC", nativeQuery = true)
    List<DiamondRequest> getDiamondRequestByCustomerId(Integer id);
    @Query(value = "SELECT * FROM diamond_request d ORDER BY d.created_date DESC", nativeQuery = true)
    List<DiamondRequest> findAllOrderByCreatedDateDesc();
    @Query(value = "SELECT COUNT(id)\n"
    		+ "FROM diamond_request d\n"
    		+ "WHERE appointment_date = ?1 AND slot_id = ?2", nativeQuery = true)
    int countRequestByDateAndSlot(String date, Integer slotId);
    
    @Query(value = "SELECT *\n"
    		+ "FROM diamond_request d\n"
    		+ "WHERE appointment_date = ?1 AND slot_id = ?2", nativeQuery = true)
	List<DiamondRequest> getRequestByDateAndSlotId(String date, Integer slotId);
}
