package com.diamondvaluation.admin.service.imp;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Month;
import java.time.Year;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.diamondvaluation.admin.exception.EmailIsAlreadyExistException;
import com.diamondvaluation.admin.exception.UsernameNotFoundException;
import com.diamondvaluation.admin.repository.CustomerRepository;
import com.diamondvaluation.admin.service.CustomerService;
import com.diamondvaluation.common.Customer;

@Service
public class CustomerServiceImp implements CustomerService {
	public static final int CUSTOMERS_PER_PAGE = 7;
	private final CustomerRepository customerRepo;
	private final PasswordEncoder passwordEncoder;

	public CustomerServiceImp(CustomerRepository customerRepo, PasswordEncoder passwordEncoder) {
		this.customerRepo = customerRepo;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public Customer save(Customer customer) {
		boolean isUpdatingCustomer = (customer.getId() != null && (customer.getId() + "").trim().length() > 0);

		if (isUpdatingCustomer) {
			Customer existingUser = customerRepo.findById(customer.getId()).get();
			customer.setCreatedTime(existingUser.getCreatedTime());
			if (customer.getPassword().isEmpty()) {
				customer.setPassword(existingUser.getPassword());
			} else {
				encodePassword(customer);
			}

		} else {
			if (isEmailExist(customer.getEmail())) {
				throw new EmailIsAlreadyExistException("Email is already exist!");
			}
			encodePassword(customer);
		}
		return customerRepo.save(customer);

	}

	private boolean isEmailExist(String email) {
		Optional<Customer> cusInDb = customerRepo.findByEmail(email);
		return cusInDb.isPresent();
	}

	private void encodePassword(Customer customer) {
		String encodedPassword = passwordEncoder.encode(customer.getPassword());
		customer.setPassword(encodedPassword);
	}

	@Override
	public boolean deleteCustomerById(Integer id) {
		Optional<Customer> customer = customerRepo.findById(id);
		if (!customer.isPresent()) {
			throw new UsernameNotFoundException("Can not find any user with Id " + id);
		}
		customerRepo.deleteById(id);
		return true;
	}

	@Override
	public Customer getCustomerById(Integer id) {
		Optional<Customer> customer = customerRepo.findById(id);
		if (!customer.isPresent()) {
			throw new UsernameNotFoundException("Can not find any user with Id " + id);
		}
		return customer.get();
	}

	@Override
	public Page<Customer> listCustomersByPage(int pageNum, String keyword) {
		Pageable pageable = PageRequest.of(pageNum - 1, CUSTOMERS_PER_PAGE);
		Page<Customer> customers = null;
		if (keyword != null && keyword.trim().length() > 0) {
			customers = customerRepo.findAll(keyword, pageable);
			return customers;
		}
		customers = customerRepo.findAll(pageable);
		return customers;
	}


	// new
	public List<Object> countCustomersByMonthForYear(int year) {
	    List<Object> monthlyStats = new ArrayList<>();
	    int yearlyTotalCount = 0;

	    for (Month month : Month.values()) {
	        List<Object> monthStats = new ArrayList<>();
	        monthStats.add("Month " + month.getValue());

	        LocalDateTime startOfMonth = Year.of(year).atMonth(month).atDay(1).atStartOfDay();
	        LocalDateTime endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.toLocalDate().lengthOfMonth()).with(LocalTime.MAX);

	        int monthlyTotalCount = customerRepo.countByCreatedTimeBetween(startOfMonth, endOfMonth);
	        
	        List<Object> totalStats = new ArrayList<>();
	        totalStats.add("Number of Customer: " + monthlyTotalCount);
	      
	        monthStats.add(totalStats);
	        monthlyStats.add(monthStats);

	        yearlyTotalCount += monthlyTotalCount;
	        
	    }

	    // Add total stats for the year
	    List<Object> yearlyTotalStats = new ArrayList<>();
	    yearlyTotalStats.add("Year Total");
	    yearlyTotalStats.add("Number of Customer: " + yearlyTotalCount);
	    
	    monthlyStats.add(yearlyTotalStats);

	    return monthlyStats;
	}


	@Override
	public List<Customer> listCustomerByKeyword(String keyword) {
		List<Customer> customers = new ArrayList<>();
		if(keyword!=null && keyword.trim().length()>0) {
			customers = customerRepo.findAllByKeyword(keyword);
			return customers;
		}
		customers = (List<Customer>) customerRepo.findAll();
		return customers;
	}
	
	
	//new
	public List<Object> countCustomerAndRevenueByDay(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = startOfDay.with(LocalTime.MAX);

        int dailyCount = customerRepo.countByCreatedTimeBetween(startOfDay, endOfDay);

        List<Object> dailyStats = new ArrayList<>();
        dailyStats.add("Date: " + date);
        dailyStats.add("Count Request: " + dailyCount);

        return dailyStats;
    }

    // Method for counting customers by month, week, and day for a year
    public List<Object> countCustomerByMonthWeekForYear(int year) {
        List<Object> yearlyStats = new ArrayList<>();
        int yearlyTotalCount = 0;

        for (Month month : Month.values()) {
            List<Object> monthStats = new ArrayList<>();
            monthStats.add("Month " + month.getValue());

            LocalDateTime startOfMonth = Year.of(year).atMonth(month).atDay(1).atStartOfDay();
            LocalDateTime endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.toLocalDate().lengthOfMonth()).with(LocalTime.MAX);

            List<Object> weekStatsList = new ArrayList<>();

            int monthlyTotalCount = 0;

            int weekNumber = 1;
            LocalDateTime startOfWeek = startOfMonth;
            while (startOfWeek.isBefore(endOfMonth)) {
                LocalDateTime endOfWeek = startOfWeek.plusDays(6).with(LocalTime.MAX);
                if (endOfWeek.isAfter(endOfMonth)) {
                    endOfWeek = endOfMonth;
                }
                int weeklyCount = customerRepo.countByCreatedTimeBetween(startOfWeek, endOfWeek);

                List<Object> weekStats = new ArrayList<>();
                weekStats.add("Week " + weekNumber);
                weekStats.add("Number of Request: " + weeklyCount);

                // Add daily stats for the week
                List<Object> dailyStatsList = new ArrayList<>();
                LocalDateTime startOfDay = startOfWeek;
                for (int day = 1; day <= 7; day++) {
                    if (startOfDay.isAfter(endOfWeek)) {
                        break;
                    }
                    LocalDateTime endOfDay = startOfDay.with(LocalTime.MAX);
                    int dailyCount = customerRepo.countByCreatedTimeBetween(startOfDay, endOfDay);

                    List<Object> dailyStats = new ArrayList<>();
                    dailyStats.add("Day " + day);
                    dailyStats.add("Count Request: " + dailyCount);
                    dailyStatsList.add(dailyStats);

                    startOfDay = startOfDay.plusDays(1).with(LocalTime.MIN);
                }
                weekStats.add(dailyStatsList);

                weekStatsList.add(weekStats);

                monthlyTotalCount += weeklyCount;
                weekNumber++;
                startOfWeek = endOfWeek.plusDays(1).with(LocalTime.MIN);
            }

            // Add total stats for the month
            List<Object> totalStats = new ArrayList<>();
            totalStats.add("Total");
            totalStats.add("Number of Request: " + monthlyTotalCount);
            weekStatsList.add(totalStats);

            monthStats.add(weekStatsList);
            yearlyStats.add(monthStats);

            yearlyTotalCount += monthlyTotalCount;
        }

        // Add total stats for the year
        List<Object> yearlyTotalStats = new ArrayList<>();
        yearlyTotalStats.add("Year Total");
        yearlyTotalStats.add("Number of Request: " + yearlyTotalCount);
        yearlyStats.add(yearlyTotalStats);

        return yearlyStats;
    }

	@Override
	public Map<Integer, Integer> countCustomerEachMonthByYear(int year) {
		Map<Integer, Integer> maps = new HashMap<>();
		for(int i=1 ; i<13 ; i++) {
			int total = customerRepo.countCustomerByMonth(i);
			maps.put(i, total);
		}
		return maps;
	}

	@Override
	public int totalCustomerByYear(int year) {
		return customerRepo.countCustomerByYear(year);
	}

}
