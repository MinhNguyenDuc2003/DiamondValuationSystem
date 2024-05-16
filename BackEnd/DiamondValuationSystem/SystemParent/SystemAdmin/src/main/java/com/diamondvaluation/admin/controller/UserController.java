package com.diamondvaluation.admin.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import com.diamondvaluation.admin.request.UserRequest;
import com.diamondvaluation.admin.response.MessageResponse;
import com.diamondvaluation.admin.response.UserResponse;
import com.diamondvaluation.admin.service.imp.UserServiceImp;
import com.diamondvaluation.common.User;

import jakarta.validation.Valid;
import software.amazon.awssdk.awscore.exception.AwsServiceException;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.services.s3.model.S3Exception;

@RestController
@RequestMapping("/api/users/")
public class UserController {
	private final UserServiceImp userService;
	private final ModelMapper modelMapper;

	@Autowired
	public UserController(UserServiceImp userService, ModelMapper modelMapper) {
		this.userService = userService;
		this.modelMapper = modelMapper;
	}

	@PostMapping("save")
	public ResponseEntity<?> addNewUser(@ModelAttribute @Valid UserRequest userRequest,
			@RequestParam("photo") MultipartFile multipartFile)
			throws S3Exception, AwsServiceException, SdkClientException, IOException {
		User user = request2Entity(userRequest);
		User savedUser = null;
		if (!multipartFile.isEmpty()) {
			String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
			user.setPhoto(fileName);
			savedUser = userService.addNewUser(user);
			if (savedUser != null) {
				String uploadDir = "user-photos/" + savedUser.getId();
				AmazonS3Util.removeFolder(uploadDir);
				AmazonS3Util.uploadFile(uploadDir, fileName, multipartFile.getInputStream());
			}
		} else {
			if (user.getPhoto().isEmpty())
				user.setPhoto(null);
			savedUser = userService.addNewUser(user);
		}

		if (savedUser == null) {
			return new ResponseEntity<>(userRequest, HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(new MessageResponse("Add new User successfully!"), HttpStatus.OK);
	}

	private User request2Entity(UserRequest request) {
		return modelMapper.map(request, User.class);
	}

	private UserResponse entity2Response(User user) {
		UserResponse userResponse = modelMapper.map(user, UserResponse.class);
		String photoName = userResponse.getImagePath();
		userResponse.setImagePath(AmazonS3Util.S3_BASE_URI+"/user-photos/"+photoName);
		return userResponse;
	}

	@DeleteMapping("delete/{id}")
	public ResponseEntity<?> delete(@PathVariable("id") Integer id) {
		boolean isDeleted = userService.deleteUserById(id);
		if (isDeleted == true) {
			return ResponseEntity.ok(new MessageResponse("user id " + id + " is deleted successfully!"));
		}
		return ResponseEntity.noContent().build();
	}

	@GetMapping("user/{id}")
	public ResponseEntity<UserResponse> getUserById(@PathVariable("id") Integer id) {
		System.out.println(entity2Response(userService.getUserById(id)));
		return new ResponseEntity<UserResponse>(entity2Response(userService.getUserById(id)), HttpStatus.OK);
	}
	
	@GetMapping("page/{pageNum}")
	public ResponseEntity<List<UserResponse>> findUserByPage(@PathVariable("pageNum")  int pageNum,
		@RequestParam(value = "keyword", required=false) String keyword){
		List<User> listUsers = userService.listUsersByPage(pageNum, keyword);
		return new ResponseEntity<List<UserResponse>>(listEntity2ListResposne(listUsers), HttpStatus.OK);
		
	}
	
	private List<UserResponse> listEntity2ListResposne(List<User> users){
		List<UserResponse> userResponses = new ArrayList<>();
		users.forEach(user -> userResponses.add(entity2Response(user)));
		return userResponses;
	}
	
	
	
}
