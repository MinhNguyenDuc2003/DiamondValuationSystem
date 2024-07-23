package com.diamondvaluation.admin.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.diamondvaluation.common.DiamondRequest;
import com.diamondvaluation.common.RequestStatus;
@Repository
public interface DiamondRequestRepository extends CrudRepository<DiamondRequest, Integer>, PagingAndSortingRepository<DiamondRequest, Integer>{
	List<DiamondRequest> findByStatusOrderByCreatedDateAsc(RequestStatus status);
    Optional<DiamondRequest> findByStatus(RequestStatus status);
    @Query(value = "SELECT * FROM diamond_request d WHERE d.customer_id = :id ORDER BY d.created_date DESC", nativeQuery = true)
    List<DiamondRequest> getDiamondRequestByCustomerId(Integer id);

    
    //new
    int countByCreatedDateBetween(LocalDateTime start, LocalDateTime end);
    @Query("SELECT SUM(dr.paymentTotal) FROM DiamondRequest dr WHERE dr.paidDate BETWEEN :start AND :end AND dr.isPaid = :isPaid")
    Optional<Double> sumPaymentTotalByCreatedDateBetweenAndPaid(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end, @Param("isPaid") Boolean isPaid);


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

    @Query(value = "SELECT dr.*\n"
    		+ "FROM diamond_request dr\n"
    		+ "JOIN assignment_request ar ON dr.id = ar.request_id AND dr.status = \"NEW\"\n"
    		+ "JOIN assignments ass ON ar.assignment_id = ass.id\n"
    		+ "JOIN users u ON ass.user_id = u.id\n"
    		+ "WHERE u.id = ?1 order by dr.created_date", nativeQuery = true)
	List<DiamondRequest> findAllRequestNewByUserId(Integer id);
    
    @Query(value = "SELECT COUNT(id) FROM diamond_request d WHERE MONTH(created_date) = ?1 AND YEAR(created_date) = ?2", nativeQuery = true)
	int countRequestByMonth(int i, int year);
    
    @Query(value = "SELECT COUNT(id) FROM diamond_request d WHERE YEAR(created_date) = ?1", nativeQuery = true)
	int countRequestByYear(int year);
    
    @Query(value = "SELECT SUM(payment_total) FROM diamond_request d WHERE d.is_paid = true AND MONTH(paid_date) = ?1 AND YEAR(paid_date) = ?2", nativeQuery = true)
	Double getRevenueByMonth(int i ,int year);
    
    @Query(value = "SELECT SUM(payment_total) FROM diamond_request d WHERE d.is_paid = true AND YEAR(paid_date) = ?1", nativeQuery = true)
    Double getRevenueByYear(int year);
    
    @Query(value = "SELECT SUM(payment_total) FROM diamond_request d WHERE d.is_paid = true AND paid_date = ?1", nativeQuery = true)
	Double getRevenueByDay(String string);
    
    @Query(value = "SELECT SUM(payment_total) FROM diamond_request d WHERE d.is_paid = true AND paid_date >= ?1 AND paid_date <= ?2", nativeQuery = true)
	Double getRevenueBetween2Day(String string, String string2);
    
    @Query(value = "SELECT COUNT(id) FROM diamond_request d WHERE Day(created_date) = ?1 AND MONTH(created_date) = ?2 AND YEAR(created_date) =?3", nativeQuery = true)
	Integer getRequestByDay(String day, String month, String year);
    
    @Query(value = "SELECT COUNT(id) FROM diamond_request d WHERE d.created_date >= ?1 AND d.created_date <= ?2", nativeQuery = true)
	int getTotalRequestBetween2Date(LocalDateTime dateTimeBegin, LocalDateTime dateTimeEnd);
}
