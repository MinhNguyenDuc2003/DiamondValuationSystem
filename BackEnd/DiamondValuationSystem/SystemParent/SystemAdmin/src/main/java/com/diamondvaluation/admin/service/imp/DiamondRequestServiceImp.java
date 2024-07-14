	package com.diamondvaluation.admin.service.imp;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Month;
import java.time.Year;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.diamondvaluation.admin.Utility;
import com.diamondvaluation.admin.exception.CustomerNotFoundException;
import com.diamondvaluation.admin.exception.RequestNotFoundException;
import com.diamondvaluation.admin.exception.ServiceNotFoundException;
import com.diamondvaluation.admin.repository.CustomerRepository;
import com.diamondvaluation.admin.repository.DiamondRequestRepository;
import com.diamondvaluation.admin.repository.RequestTrackRepository;
import com.diamondvaluation.admin.repository.ServiceRepository;
import com.diamondvaluation.admin.service.DiamondRequestService;
import com.diamondvaluation.common.Customer;
import com.diamondvaluation.common.DiamondRequest;
import com.diamondvaluation.common.DiamondService;
import com.diamondvaluation.common.RequestStatus;
import com.diamondvaluation.common.RequestTrack;
import com.diamondvaluation.common.User;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

@Service
public class DiamondRequestServiceImp implements DiamondRequestService{
	private final DiamondRequestRepository repo;
	private final ServiceRepository serviceRepo;
	private final RequestTrackRepository trackingRepo;
	private final CustomerRepository cusRepo;
	
	public DiamondRequestServiceImp(DiamondRequestRepository repo, RequestTrackRepository trackingRepo,
			ServiceRepository serviceRepo, CustomerRepository cusRepo) {
		this.repo = repo;
		this.trackingRepo = trackingRepo;
		this.serviceRepo = serviceRepo;
		this.cusRepo = cusRepo;
	}

	@Transactional
	@Override
	public void save(DiamondRequest diamondRequest, HttpServletRequest request) {
		
		RequestTrack track = new RequestTrack();
		Date date = new Date();
		track.setUpdatedTime(date);
		User user = Utility.getIdOfAuthenticatedUser(request);
		track.setUpdatedBy(user);
		track.setNote(diamondRequest.getNote());
		track.setRequest(diamondRequest);
		track.setStatus(diamondRequest.getStatus());
		if(diamondRequest.getId() != null) {
			Optional<DiamondRequest> appoinment = repo.findById(diamondRequest.getId());
			if(!appoinment.isPresent()) {
				throw new RequestNotFoundException("Can not find any appoinment with id: " + diamondRequest.getId());
			}
			diamondRequest.setCreatedDate(appoinment.get().getCreatedDate());
		}
		double money = 0.0;
		for(DiamondService service : diamondRequest.getServices()) {
			Optional<DiamondService> ds = serviceRepo.findById(service.getId());
			if(!ds.isPresent()) {
				throw new ServiceNotFoundException("Service is not exist!");
			}
			money += ds.get().getMoney();
		}
		diamondRequest.setPaymentTotal(money);
		trackingRepo.save(track);
		repo.save(diamondRequest);
	}



	@Override
	public DiamondRequest getRequestById(Integer id) {
		Optional<DiamondRequest> appoinment = repo.findById(id);
		if(!appoinment.isPresent()) {
			throw new RequestNotFoundException("Can not find any appoinment with id: " + id);
		}
		return appoinment.get();
	}



	@Override
	public void deleteById(Integer id) {
		Optional<DiamondRequest> appoinment = repo.findById(id);
		if(!appoinment.isPresent()) {
			throw new RequestNotFoundException("Can not find any appoinment with id: " + id);
		}
		repo.delete(appoinment.get());
	}



	@Override
	public List<DiamondRequest> findAllRequest() {
		return (List<DiamondRequest>) repo.findAll();
	}
	
	
	public List<DiamondRequest> findRequestsByStatusSortedByCreatedDate(RequestStatus status) {
        return repo.findByStatusOrderByCreatedDateAsc(status);
    }

    @Transactional
    @Override
    public void updateRequestStatus(Integer id, RequestStatus status, HttpServletRequest request) {
    	DiamondRequest diamondRequest = getRequestById(id);
    	RequestTrack track = new RequestTrack();
		Date date = new Date();
		track.setUpdatedTime(date);
		User user = Utility.getIdOfAuthenticatedUser(request);
		track.setUpdatedBy(user);
		track.setNote(diamondRequest.getNote());
		track.setRequest(diamondRequest);
		track.setStatus(diamondRequest.getStatus());
		diamondRequest.setStatus(status);
        repo.save(diamondRequest);
    }

	@Override
	public List<DiamondRequest> getRequestByCustomerId(Integer id) {
		Optional<Customer> customer = cusRepo.findById(id);
		if(!customer.isPresent()) {
			throw new CustomerNotFoundException("Cannot find any Customer with id" + id);
		}
		return repo.getDiamondRequestByCustomerId(id);
	}

	
	//new
    @Override
    public Map<String, Integer> countRequestsByMonthForYear(int year) {
        Map<String, Integer> monthlyCounts = new LinkedHashMap<>();
        int totalRequests = 0;

        for (Month month : Month.values()) {
            LocalDateTime startOfMonth = Year.of(year).atMonth(month).atDay(1).atStartOfDay();
            LocalDateTime endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.toLocalDate().lengthOfMonth()).with(LocalTime.MAX);
            int count = repo.countByCreatedDateBetween(startOfMonth, endOfMonth);
            monthlyCounts.put(month.name(), count);
            totalRequests += count;
        }

        monthlyCounts.put("Total", totalRequests);
        return monthlyCounts;
    }
    
    @Override
    public Map<String, Object> countRevenuesByMonthForYear(int year) {
        Map<String, Object> monthlyStats = new LinkedHashMap<>();
        int totalRequests = 0;
        double totalRevenue = 0.0;

        for (Month month : Month.values()) {
            LocalDateTime startOfMonth = Year.of(year).atMonth(month).atDay(1).atStartOfDay();
            LocalDateTime endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.toLocalDate().lengthOfMonth()).with(LocalTime.MAX);

            int count = repo.countByCreatedDateBetween(startOfMonth, endOfMonth);
            Optional<Double> revenueOptional = repo.sumPaymentTotalByCreatedDateBetweenAndStatus(startOfMonth, endOfMonth, RequestStatus.DONE);
            double revenue = revenueOptional.orElse(0.0); // Default to 0.0 if revenueOptional is empty

            monthlyStats.put(month.name(), Map.of("count", count, "revenue", revenue));
            totalRequests += count;
            totalRevenue += revenue;
        }

        monthlyStats.put("Total", Map.of("count", totalRequests, "revenue", totalRevenue));
        return monthlyStats;
    }

}
