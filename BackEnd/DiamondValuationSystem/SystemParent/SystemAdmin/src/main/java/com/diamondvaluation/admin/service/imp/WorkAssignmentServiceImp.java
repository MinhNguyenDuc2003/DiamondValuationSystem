package com.diamondvaluation.admin.service.imp;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.diamondvaluation.admin.exception.AssignmentAlreadyExist;
import com.diamondvaluation.admin.exception.AssignmentNotFoundException;
import com.diamondvaluation.admin.exception.RequestNotFoundException;
import com.diamondvaluation.admin.repository.WorkAssignmentRepository;
import com.diamondvaluation.admin.request.ValuationStaffAssignmentRequest;
import com.diamondvaluation.admin.response.AssignmentResponse;
import com.diamondvaluation.admin.response.ValuationStaffAssignmentResponse;
import com.diamondvaluation.admin.service.DiamondRequestService;
import com.diamondvaluation.admin.service.UserService;
import com.diamondvaluation.admin.service.WorkAssignmentService;
import com.diamondvaluation.common.DiamondRequest;
import com.diamondvaluation.common.RequestStatus;
import com.diamondvaluation.common.User;
import com.diamondvaluation.common.WorkAssignment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WorkAssignmentServiceImp implements WorkAssignmentService{
	private final WorkAssignmentRepository repo;
	private final UserService userService;
	private final DiamondRequestService requestService;
	
	@Override
	public void save(WorkAssignment assignment) {
		if(assignment.getId() != null && assignment.getId()!=0) {
			Optional<WorkAssignment> db = repo.findById(assignment.getId());
			if(!db.isPresent()) {
				throw new AssignmentNotFoundException("Cannot find any assginment with id");
			}
		}else {
			Optional<WorkAssignment> existAssignment = repo.findByUserIdAndDate(assignment.getUser().getId(), assignment.getDate());
			if(existAssignment.isPresent()) {
				throw new AssignmentAlreadyExist("User with this assignment already exist");
			}
		}
		User user = userService.getUserById(assignment.getUser().getId());
		assignment.setUser(user);
		repo.save(assignment);
	}

	@Override
	public List<AssignmentResponse> getAllByDate(LocalDate date) {
		List<WorkAssignment> list =repo.findAllByDate(date);
		List<AssignmentResponse> listResponse = new ArrayList<>();
		for(WorkAssignment a : list) {
			AssignmentResponse response = new AssignmentResponse();
			response.setDate(a.getDate().toString());
			response.setId(a.getId());
			response.setUserName(a.getUser().getFirstName()+ " " + a.getUser().getLastName());
			response.setStatus(a.isStatus());
			listResponse.add(response);
		}
		return listResponse;
	}

	@Override
	public void updateStatus(Integer id, boolean status) {
		Optional<WorkAssignment> existAssignment = repo.findById(id);
		if(!existAssignment.isPresent()) {
			throw new AssignmentNotFoundException("Cannot find any assginment with id");
		}
		repo.updateStatusById(id, status);
	}

	@Override
	public void deleteById(Integer id) {
		Optional<WorkAssignment> existAssignment = repo.findById(id);
		if(!existAssignment.isPresent()) {
			throw new AssignmentNotFoundException("Cannot find any assginment with id");
		}
		repo.deleteById(id);
	}

	@Override
	public void findByUserIdAndDate(Integer id, LocalDate date) {
		Optional<WorkAssignment> existAssignment = repo.findByUserIdAndDate(id, date);
		if(existAssignment.isPresent()) {
			throw new AssignmentAlreadyExist("User with this assignment already exist");
		}
	}

	@Override
	public void setStaffToRequest(@Valid ValuationStaffAssignmentRequest request) {
		Optional<WorkAssignment> existAssignment = repo.findById(request.getAssignmentId());
		if(!existAssignment.isPresent()) {
			throw new AssignmentNotFoundException("Cannot find any assginment with id");
		}
		if(existAssignment.get().isStatus() == false) {
			throw new AssignmentNotFoundException("Staff Assignment today is absent");
		}
		Optional<DiamondRequest> diamondRequest = requestService.findById(request.getRequestId());
		if(!diamondRequest.isPresent()) {
			throw new RequestNotFoundException("Cannot find any request with id");
		}
		WorkAssignment a = existAssignment.get();
		a.getRequests().add(diamondRequest.get());
		repo.save(a);
	}

	@Override
	public List<ValuationStaffAssignmentResponse> getAllValuationStaffAvailable(LocalDate date) {
		List<User> listUserByDateAndRole = getAllUserWithRoleAndDate("valuationStaff", date);
		List<ValuationStaffAssignmentResponse> responses = new ArrayList<>();
		for(User user : listUserByDateAndRole) {
			ValuationStaffAssignmentResponse response = new ValuationStaffAssignmentResponse();
			response.setName(user.getFirstName() + " " + user.getLastName());
			response.setPhoneNumber(user.getPhoneNumber());
			response.setNumberRequestProcessing(countNumberProcessingRequest(user.getId(), date));
			response.setAssignmentid(repo.findByUserIdAndDateAndOn(user.getId(), date).get().getId());
			responses.add(response);
			System.out.println(user.getId());
		}
		return responses;
	}
	
	public int countNumberProcessingRequest(Integer user_id, LocalDate date) {
		Optional<WorkAssignment> existAssignment = repo.findByUserIdAndDateAndOn(user_id, date);
		if(!existAssignment.isPresent()) {
			throw new RequestNotFoundException("Cannot find any assignment with id or user is off today!");
		}
		int count = 0;
		List<DiamondRequest> list = existAssignment.get().getRequests();
		for(DiamondRequest d : list) {
			if(d.getStatus().equals(RequestStatus.NEW)) {
				count++;
			}
		}
		return count;
	}
	
	public List<User> getAllUserWithRoleAndDate(String role, LocalDate date){
		List<WorkAssignment> assignments = repo.findAllByDateAndOn(date);
		List<User> users = new ArrayList<>();
		for(WorkAssignment w : assignments) {
			User u = w.getUser();
			if(u.getRoles().stream().anyMatch(o -> o.getName().equals(role))) {
				users.add(u);
			}
		}
		return users;
	}
}
