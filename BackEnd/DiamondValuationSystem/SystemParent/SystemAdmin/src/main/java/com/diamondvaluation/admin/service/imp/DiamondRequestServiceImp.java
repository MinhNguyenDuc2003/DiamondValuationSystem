	package com.diamondvaluation.admin.service.imp;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Month;
import java.time.Year;

import java.util.ArrayList;

import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.diamondvaluation.admin.Utility;
import com.diamondvaluation.admin.exception.CustomerNotFoundException;
import com.diamondvaluation.admin.exception.RequestNotFoundException;
import com.diamondvaluation.admin.exception.ServiceNotFoundException;
import com.diamondvaluation.admin.exception.SlotTimeIsAlreadyFull;
import com.diamondvaluation.admin.exception.SlotTimeNotFoundException;
import com.diamondvaluation.admin.repository.CustomerRepository;
import com.diamondvaluation.admin.repository.DiamondRequestRepository;
import com.diamondvaluation.admin.repository.RequestTrackRepository;
import com.diamondvaluation.admin.repository.ServiceRepository;
import com.diamondvaluation.admin.repository.SlotTimeRepository;
import com.diamondvaluation.admin.service.DiamondRequestService;
import com.diamondvaluation.admin.service.UserService;
import com.diamondvaluation.common.Customer;
import com.diamondvaluation.common.DiamondRequest;
import com.diamondvaluation.common.DiamondService;
import com.diamondvaluation.common.RequestStatus;
import com.diamondvaluation.common.RequestTrack;
import com.diamondvaluation.common.SlotTime;
import com.diamondvaluation.common.User;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

@Service
public class DiamondRequestServiceImp implements DiamondRequestService {
	private final DiamondRequestRepository repo;
	private final ServiceRepository serviceRepo;
	private final RequestTrackRepository trackingRepo;
	private final CustomerRepository cusRepo;
	private final UserService userService;
	private final SlotTimeRepository slotRepo;


	public DiamondRequestServiceImp(DiamondRequestRepository repo, ServiceRepository serviceRepo,
			RequestTrackRepository trackingRepo, CustomerRepository cusRepo, UserService userService,
			SlotTimeRepository slotRepo) {
		this.repo = repo;
		this.serviceRepo = serviceRepo;
		this.trackingRepo = trackingRepo;
		this.cusRepo = cusRepo;
		this.userService = userService;
		this.slotRepo = slotRepo;
	}

	@Transactional
	@Override
	public void save(DiamondRequest diamondRequest, HttpServletRequest request) {

		RequestTrack track = new RequestTrack();
		Date date = new Date();
		track.setUpdatedTime(date);
		User user = Utility.getIdOfAuthenticatedUser(request, userService);
		track.setUpdatedBy(user);
		track.setNote(diamondRequest.getNote());
		track.setRequest(diamondRequest);
		track.setStatus(diamondRequest.getStatus());
		if (diamondRequest.getId() != null) {
			Optional<DiamondRequest> appoinment = repo.findById(diamondRequest.getId());
			if (!appoinment.isPresent()) {
				throw new RequestNotFoundException("Can not find any appoinment with id: " + diamondRequest.getId());
			}
			diamondRequest.setCreatedDate(appoinment.get().getCreatedDate());
		}
		double money = 0.0;
		for (DiamondService service : diamondRequest.getServices()) {
			Optional<DiamondService> ds = serviceRepo.findById(service.getId());
			if (!ds.isPresent()) {
				throw new ServiceNotFoundException("Service is not exist!");
			}
			money += ds.get().getMoney();
		}
		diamondRequest.setPaymentTotal(money);
		if(diamondRequest.getSlot()!=null) {
			Optional<SlotTime> slot = slotRepo.findById(diamondRequest.getSlot().getId());
			if(!slot.isPresent()) {
				throw new SlotTimeNotFoundException("Cannot find any slottime with id!");
			}
			diamondRequest.setSlot(slot.get());
			int numberRequestBySlotAndDate = repo.countRequestByDateAndSlot(diamondRequest.getAppointmentDate().toString(), diamondRequest.getSlot().getId());
			int numberLimit = slotRepo.getNumberById(diamondRequest.getSlot().getId()).getNumber();
			if(numberRequestBySlotAndDate>= numberLimit) {
				throw new SlotTimeIsAlreadyFull("Cannot add request in this time!");
			}
		}
		if(diamondRequest.isPaid()) {
			diamondRequest.setPaidDate(LocalDate.now());
		}
		trackingRepo.save(track);
		repo.save(diamondRequest);
	}

	@Override
	public DiamondRequest getRequestById(Integer id) {
		Optional<DiamondRequest> appoinment = repo.findById(id);
		if (!appoinment.isPresent()) {
			throw new RequestNotFoundException("Can not find any appoinment with id: " + id);
		}
		return appoinment.get();
	}

	@Override
	public void deleteById(Integer id) {
		Optional<DiamondRequest> appoinment = repo.findById(id);
		if (!appoinment.isPresent()) {
			throw new RequestNotFoundException("Can not find any appoinment with id: " + id);
		}
		repo.delete(appoinment.get());
	}

	@Override
	public List<DiamondRequest> findAllRequest() {
		return repo.findAllOrderByCreatedDateDesc();
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
		User user = Utility.getIdOfAuthenticatedUser(request, userService);
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
		if (!customer.isPresent()) {
			throw new CustomerNotFoundException("Cannot find any Customer with id" + id);
		}
		return repo.getDiamondRequestByCustomerId(id);
	}


	
	//new
	
    

	@Override
	public List<DiamondRequest> getRequestByDateAndSlot(String date, Integer slotId) {
		return repo.getRequestByDateAndSlotId(date, slotId);
	}

	@Override
	public List<SlotTime> getSlotAvailableByDate(String date) {
		List<SlotTime> listSlot = (List<SlotTime>) slotRepo.findAll();
		List<SlotTime> available = new ArrayList<>();
		for(SlotTime s : listSlot) {
			int limit = s.getNumber();
			int now = repo.countRequestByDateAndSlot(date, s.getId());
			if(now < limit) {
				available.add(s);
			}
		}
		return available;
	}
	
	
	//new 
//	@Override
//	public Map<String, Map<String, Object>> countRevenuesByMonthWeekDayForYear(int year) {
//	    Map<String, Map<String, Object>> monthlyStats = new LinkedHashMap<>();
//	    for (Month month : Month.values()) {
//	        LocalDateTime startOfMonth = Year.of(year).atMonth(month).atDay(1).atStartOfDay();
//	        LocalDateTime endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.toLocalDate().lengthOfMonth()).with(LocalTime.MAX);
//	        Map<String, Object> stats = new LinkedHashMap<>();
//
//	        int totalCount = 0;
//	        double totalRevenue = 0.0;
//	        int weekNumber = 1;
//	        LocalDateTime startOfWeek = startOfMonth;
//	        while (startOfWeek.isBefore(endOfMonth)) {
//	            LocalDateTime endOfWeek = startOfWeek.plusDays(6).with(LocalTime.MAX);
//	            if (endOfWeek.isAfter(endOfMonth)) {
//	                endOfWeek = endOfMonth;
//	            }
//	            int weeklyCount = repo.countByCreatedDateBetween(startOfWeek, endOfWeek);
//	            Optional<Double> weeklyRevenueOptional = repo.sumPaymentTotalByCreatedDateBetweenAndStatus(startOfWeek, endOfWeek, Boolean.TRUE);
//	            double weeklyRevenue = weeklyRevenueOptional.orElse(0.0);
//
//	            stats.put("Week " + weekNumber, Map.of("count", weeklyCount, "revenue", weeklyRevenue));
//	            totalCount += weeklyCount;
//	            totalRevenue += weeklyRevenue;
//	            weekNumber++;
//	            startOfWeek = endOfWeek.plusDays(1).with(LocalTime.MIN);
//	        }
//
//	        int dayOfMonth = 1;
//	        LocalDateTime startOfDay = startOfMonth;
//	        while (startOfDay.isBefore(endOfMonth)) {
//	            LocalDateTime endOfDay = startOfDay.with(LocalTime.MAX);
//	            int dailyCount = repo.countByCreatedDateBetween(startOfDay, endOfDay);
//	            Optional<Double> dailyRevenueOptional = repo.sumPaymentTotalByCreatedDateBetweenAndStatus(startOfDay, endOfDay, Boolean.TRUE);
//	            double dailyRevenue = dailyRevenueOptional.orElse(0.0);
//
//	            stats.put("Day " + dayOfMonth, Map.of("count", dailyCount, "revenue", dailyRevenue));
//	            dayOfMonth++;
//	            startOfDay = endOfDay.plusDays(1).with(LocalTime.MIN);
//	        }
//
//	        stats.put("Total", Map.of("count", totalCount, "revenue", totalRevenue));
//	        monthlyStats.put(month.name(), stats);
//	    }
//	    return monthlyStats;
//	}
	
	
	public List<Object> countRequestsAndRevenueByDay(LocalDate date) {
	    // Calculate start and end of the day
	    LocalDateTime startOfDay = date.atStartOfDay();
	    LocalDateTime endOfDay = startOfDay.plusDays(1).minusNanos(1);

	    // Count requests
	    int requestCount = repo.countByCreatedDateBetween(startOfDay, endOfDay);

	    // Calculate revenue
	    Optional<Double> totalRevenueOptional = repo.sumPaymentTotalByCreatedDateBetweenAndPaid(startOfDay, endOfDay, true);
	    double totalRevenue = totalRevenueOptional.orElse(0.0);

	    // Create a list to store results
	    List<Object> result = new ArrayList<>();

	    // Add requestCount as an object
	    result.add("Count Request: " + requestCount);

	    // Add totalRevenue as an object
	    result.add("Total Revenue Paided: " + totalRevenue);

	    return result;
	}
	
	
//	public List<Object> countRevenuesByMonthWeekForYear(int year) {
//        List<Object> monthlyStats = new ArrayList<>();
//        int yearlyTotalCount = 0;
//        double yearlyTotalRevenue = 0.0;
//
//        for (Month month : Month.values()) {
//            List<Object> monthStats = new ArrayList<>();
//            monthStats.add("Month " + month.getValue());
//
//            LocalDateTime startOfMonth = Year.of(year).atMonth(month).atDay(1).atStartOfDay();
//            LocalDateTime endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.toLocalDate().lengthOfMonth()).with(LocalTime.MAX);
//
//            List<Object> weekStatsList = new ArrayList<>();
//
//            int monthlyTotalCount = 0;
//            double monthlyTotalRevenue = 0.0;
//
//            int weekNumber = 1;
//            LocalDateTime startOfWeek = startOfMonth;
//            while (startOfWeek.isBefore(endOfMonth)) {
//                LocalDateTime endOfWeek = startOfWeek.plusDays(6).with(LocalTime.MAX);
//                if (endOfWeek.isAfter(endOfMonth)) {
//                    endOfWeek = endOfMonth;
//                }
//                int weeklyCount = repo.countByCreatedDateBetween(startOfWeek, endOfWeek);
//                Optional<Double> weeklyRevenueOptional = repo.sumPaymentTotalByCreatedDateBetweenAndPaid(startOfWeek, endOfWeek, Boolean.TRUE);
//                double weeklyRevenue = weeklyRevenueOptional.orElse(0.0);
//
//                List<Object> weekStats = new ArrayList<>();
//                weekStats.add("Week " + weekNumber);
//                weekStats.add("Number of Request: " + weeklyCount);
//                weekStats.add("Revenues in Week: " + weeklyRevenue);
//                weekStatsList.add(weekStats);
//
//                monthlyTotalCount += weeklyCount;
//                monthlyTotalRevenue += weeklyRevenue;
//                weekNumber++;
//                startOfWeek = endOfWeek.plusDays(1).with(LocalTime.MIN);
//            }
//
//             Add total stats for the month
//            List<Object> totalStats = new ArrayList<>();
//            totalStats.add("Total");
//            totalStats.add("Number of Request: " + monthlyTotalCount);
//            totalStats.add("Revenues in Month: " + monthlyTotalRevenue);
//            weekStatsList.add(totalStats);
//
//            monthStats.add(weekStatsList);
//            monthlyStats.add(monthStats);
//
//            yearlyTotalCount += monthlyTotalCount;
//            yearlyTotalRevenue += monthlyTotalRevenue;
//        }
//
//        // Add total stats for the year
//        List<Object> yearlyTotalStats = new ArrayList<>();
//        yearlyTotalStats.add("Year Total");
//        yearlyTotalStats.add("Number of Request: " + yearlyTotalCount);
//        yearlyTotalStats.add("Revenues in Year: " +yearlyTotalRevenue);
//        monthlyStats.add(yearlyTotalStats);
//
//        return monthlyStats;
//    }
	
	public List<Object> countRevenuesByMonthWeekForYear(int year) {
	    List<Object> monthlyStats = new ArrayList<>();
	    int yearlyTotalCount = 0;
	    double yearlyTotalRevenue = 0.0;

	    for (Month month : Month.values()) {
	        List<Object> monthStats = new ArrayList<>();
	        monthStats.add("Month " + month.getValue());

	        LocalDateTime startOfMonth = Year.of(year).atMonth(month).atDay(1).atStartOfDay();
	        LocalDateTime endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.toLocalDate().lengthOfMonth()).with(LocalTime.MAX);

	        int monthlyTotalCount = repo.countByCreatedDateBetween(startOfMonth, endOfMonth);
	        Optional<Double> monthlyRevenueOptional = repo.sumPaymentTotalByCreatedDateBetweenAndPaid(startOfMonth, endOfMonth, true);
	        double monthlyTotalRevenue = monthlyRevenueOptional.orElse(0.0);

	        List<Object> totalStats = new ArrayList<>();
	        totalStats.add("Number of Request: " + monthlyTotalCount);
	        totalStats.add("Revenues in Month is paid: " + monthlyTotalRevenue);

	        monthStats.add(totalStats);
	        monthlyStats.add(monthStats);

	        yearlyTotalCount += monthlyTotalCount;
	        yearlyTotalRevenue += monthlyTotalRevenue;
	    }

	    // Add total stats for the year
	    List<Object> yearlyTotalStats = new ArrayList<>();
	    yearlyTotalStats.add("Year Total");
	    yearlyTotalStats.add("Number of Request: " + yearlyTotalCount);
	    yearlyTotalStats.add("Revenues in Year: " + yearlyTotalRevenue);
	    monthlyStats.add(yearlyTotalStats);

	    return monthlyStats;
	}


	
	public List<Object> countRequestsAndRevenueByDateRange(LocalDate startDate, LocalDate endDate) {
        // Create a list to store results
        List<Object> result = new ArrayList<>();

        // Loop through each date in the range
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            LocalDateTime startOfDay = currentDate.atStartOfDay();
            LocalDateTime endOfDay = currentDate.atTime(LocalTime.MAX);

            // Count requests
            int requestCount = repo.countByCreatedDateBetween(startOfDay, endOfDay);

            // Calculate revenue
            Optional<Double> totalRevenueOptional = repo.sumPaymentTotalByCreatedDateBetweenAndPaid(startOfDay, endOfDay, true);
            double totalRevenue = totalRevenueOptional.orElse(0.0);

            // Create a list to store the daily results
            List<Object> dailyResult = new ArrayList<>();
            dailyResult.add("Date: " + currentDate);
            dailyResult.add("Total Request: " + requestCount);
            dailyResult.add("Total Revenue Paid: " + totalRevenue);

            // Add daily results to the main result list
            result.add(dailyResult);

            // Move to the next date
            currentDate = currentDate.plusDays(1);
        }

        return result;
    }
	
	@Override
	public Optional<DiamondRequest> findById(Integer requestId) {
		return repo.findById(requestId);
	}

	@Override
	public List<DiamondRequest> findAllRequestNewByUser(User user) {
		return repo.findAllRequestNewByUserId(user.getId());
	}

	@Override
	public Map<Integer, Integer> countRequestEachMonthByYear(int year) {
		Map<Integer, Integer> maps = new HashMap<>();
		for(int i=1 ; i<13 ; i++) {
			int total = repo.countRequestByMonth(i);
			maps.put(i, total);
		}
		return maps;
	}

	@Override
	public int totalRequestByYear(int year) {
		return repo.countRequestByYear(year);
	}

	@Override
	public Map<Integer, Double> revenueRequestEachMonthByYear(int year) {
		Map<Integer, Double> maps = new HashMap<>();
		for(int i=1 ; i<13 ; i++) {
			Double revenue = repo.getRevenueByMonth(i);
			if(revenue == null) {
				maps.put(i, 0.0);
			}else
				maps.put(i, revenue);
		}
		return maps;
	}

	@Override
	public double revenueByYear(int year) {
		return repo.getRevenueByYear(year);
	}

	@Override
	public Map<String, Double> revenueRequestEachDay(LocalDate dateBegin, LocalDate dateEnd) {
		Map<String, Double> map = new HashMap<>();
		while(!dateBegin.isAfter(dateEnd)) {
			Double x = repo.getRevenueByDay(dateBegin.toString());
			if(x == null) {
				map.put(dateBegin.toString(), 0.0);
			}else
				map.put(dateBegin.toString(), x);
			
			dateBegin = dateBegin.plusDays(1);
		}
		return map;
	}

	@Override
	public double revenueBetween2DAte(LocalDate dateBegin, LocalDate dateEnd) {
		return repo.getRevenueBetween2Day(dateBegin.toString(), dateEnd.toString());
	}

	@Override
	public Map<String, Integer> countRequestEachDate(LocalDate dateBegin, LocalDate dateEnd) {
		Map<String, Integer> map = new HashMap<>();
		while(!dateBegin.isAfter(dateEnd)) {
			String[] arr = dateBegin.toString().split("-");
			Integer x = repo.getRequestByDay(arr[2], arr[1] , arr[0]);
			if(x == null) {
				map.put(dateBegin.toString(), 0);
			}else
				map.put(dateBegin.toString(), x);
			
			dateBegin = dateBegin.plusDays(1);
		}
		return map;
	}

	@Override
	public int totalRequestBetweenDate(LocalDate dateBegin, LocalDate dateEnd) {
		LocalDateTime dateTimeBegin = dateBegin.atStartOfDay();
		LocalDateTime dateTimeEnd = dateEnd.plusDays(1).atStartOfDay();
		return repo.getTotalRequestBetween2Date(dateTimeBegin, dateTimeEnd);
	}

}
