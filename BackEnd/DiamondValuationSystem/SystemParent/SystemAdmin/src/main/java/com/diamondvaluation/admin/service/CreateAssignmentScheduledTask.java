package com.diamondvaluation.admin.service;

import java.time.LocalDate;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.diamondvaluation.admin.exception.AssignmentAlreadyExist;
import com.diamondvaluation.common.User;
import com.diamondvaluation.common.WorkAssignment;

import lombok.RequiredArgsConstructor;

@Component
@EnableScheduling
@RequiredArgsConstructor
public class CreateAssignmentScheduledTask {
	private final WorkAssignmentService service;
	private final UserService userService;
	private static final Logger LOGGER = LoggerFactory.getLogger(CreateAssignmentScheduledTask.class);
	@Scheduled(cron = "0 0 12 * * SUN")
	public void createWeekAssignmentOfUserOnSunday() {
		List<User> users = userService.getAllUserEnabled();
		LocalDate now = LocalDate.now();
		for(int i=1 ; i<7; i++) {
			for(User u : users) {
				WorkAssignment assignment = new WorkAssignment();
				assignment.setDate(now.plusDays(i));
				assignment.setUser(u);
				assignment.setStatus(true);
				try {
					service.findByUserIdAndDate(u.getId(), assignment.getDate());
					service.save(assignment);
				} catch (AssignmentAlreadyExist e) {
					LOGGER.info("Assignment already exist in db with user id :" + u.getId());
				}
				
			}
		}
		
	}
}
