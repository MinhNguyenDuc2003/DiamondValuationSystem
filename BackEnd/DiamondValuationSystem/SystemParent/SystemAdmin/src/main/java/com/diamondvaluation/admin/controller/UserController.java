package com.diamondvaluation.admin.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.diamondvaluation.admin.AmazonS3Util;
import com.diamondvaluation.admin.exception.EmailIsAlreadyExistException;
import com.diamondvaluation.admin.request.UserRequest;
import com.diamondvaluation.admin.response.MessageResponse;
import com.diamondvaluation.admin.response.UserPageResponse;
import com.diamondvaluation.admin.response.UserResponse;
import com.diamondvaluation.admin.service.UserService;
import com.diamondvaluation.common.Role;
import com.diamondvaluation.common.User;

import jakarta.validation.Valid;
import software.amazon.awssdk.awscore.exception.AwsServiceException;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.services.s3.model.S3Exception;

@RestController
@RequestMapping("/api/users/")
public class UserController {
	private final UserService userService;
	private final ModelMapper modelMapper;

	@Autowired
	public UserController(UserService userService, ModelMapper modelMapper) {
		this.userService = userService;
		this.modelMapper = modelMapper;
	}

	@PostMapping("user/save")
	public ResponseEntity<?> addNewUser(@ModelAttribute @Valid UserRequest userRequest,
			@RequestParam(name = "photo", required = false) MultipartFile multipartFile)
			throws S3Exception, AwsServiceException, SdkClientException, IOException {
		try {
			User user = request2Entity(userRequest);
			User savedUser = null;
			if (multipartFile!=null && !multipartFile.isEmpty()) {
				String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
				user.setPhoto(fileName);
				savedUser = userService.addNewUser(user);
				if (savedUser != null) {
					String uploadDir = "user-photos/" + savedUser.getId();
					AmazonS3Util.removeFolder(uploadDir);
					AmazonS3Util.uploadFile(uploadDir, fileName, multipartFile.getInputStream());
				}
			} else {
				if (user.getPhoto()==null || user.getPhoto().isEmpty())
					user.setPhoto(null);
				savedUser = userService.addNewUser(user);
			}

			if (savedUser == null) {
				return ResponseEntity.badRequest().build();
			}
			return new ResponseEntity<>(new MessageResponse("Add/Update User successfully!"), HttpStatus.OK);
		} catch (EmailIsAlreadyExistException e) {
			return ResponseEntity.status(HttpStatus.OK).body(e.getMessage());
		}
		
	}

	private User request2Entity(UserRequest request) {
		User user = modelMapper.map(request, User.class);
		List<String> roleRequest = request.getRoles();
		Set<Role> roles = new HashSet<>();
		for(int i=0 ; i < roleRequest.size(); i++) {
			Role role = new Role(Integer.parseInt(roleRequest.get(i)));
			roles.add(role);
		}
		user.setRoles(roles);
		user.setFirstName(request.getFirst_name());
		user.setLastName(request.getLast_name());
		user.setPhoneNumber(request.getPhone_number());
		return user;
	}

	private UserResponse entity2Response(User user) {
		UserResponse userResponse = modelMapper.map(user, UserResponse.class);
		String photoName = userResponse.getPhoto();
		userResponse.setPhoto(AmazonS3Util.S3_BASE_URI+"/user-photos/"+user.getId()+"/"+photoName);
		userResponse.setRoleIds(user.getListRoleIds());
		userResponse.setRoleNames(user.getRolesName());
		return userResponse;
	}

	@DeleteMapping("delete/{id}")
	public ResponseEntity<?> delete(@PathVariable("id") Integer id) {
		try {
			boolean isDeleted = userService.deleteUserById(id);
			if (isDeleted == true) {
				String userPhotosDir = "user-photos/" + id;
				AmazonS3Util.removeFolder(userPhotosDir);
				return ResponseEntity.ok(new MessageResponse("user id " + id + " is deleted successfully!"));
			}
		} catch (UsernameNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(e.getMessage());
		}
		return ResponseEntity.badRequest().build();
		
		
	}

	@GetMapping("user/{id}")
	public ResponseEntity<?> getUserById(@PathVariable("id") Integer id) {
		try {
			return new ResponseEntity<UserResponse>(entity2Response(userService.getUserById(id)), HttpStatus.OK);
		} catch (UsernameNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(e.getMessage());
		}
	}
	
	@GetMapping("page/{pageNum}")
	public ResponseEntity<UserPageResponse> findUserByPage(@PathVariable("pageNum")  int pageNum,
		@RequestParam(value = "keyword", required=false) String keyword){
		Page<User> listUsers = userService.listUsersByPage(pageNum, keyword);
		int totalPage = listUsers.getTotalPages();
		List<UserResponse> list = listEntity2ListResposne(listUsers.get().toList());
		UserPageResponse response = new UserPageResponse(list, totalPage);
		return new ResponseEntity<UserPageResponse>(response, HttpStatus.OK);
	}
	
	private List<UserResponse> listEntity2ListResposne(List<User> users){
		List<UserResponse> userResponses = new ArrayList<>();
		users.forEach(user -> userResponses.add(entity2Response(user)));
		return userResponses;
	}
	
	@GetMapping("user/roles")
	private ResponseEntity<List<Role>> listAllRoles(){
		return new ResponseEntity<List<Role>>(userService.getAllRoles(), HttpStatus.OK);
	}
	
	
	
}
