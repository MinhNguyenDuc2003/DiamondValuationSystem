package com.diamondvaluation.admin.service;

import java.util.List;

import com.diamondvaluation.common.User;

public interface UserService {
	User addNewUser(User user);

	User findByUserName(String email);
	
	boolean deleteUserById(Integer id);
	
	User getUserById(Integer id);
	
	List<User> listUsersByPage(int pageNum, String keyword);
}
