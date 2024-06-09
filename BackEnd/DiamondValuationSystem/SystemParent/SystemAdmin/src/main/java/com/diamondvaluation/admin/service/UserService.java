package com.diamondvaluation.admin.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.diamondvaluation.common.Role;
import com.diamondvaluation.common.User;

public interface UserService {
	User addNewUser(User user);

	User findByUserName(String email);
	
	boolean deleteUserById(Integer id);
	
	User getUserById(Integer id);
	
	Page<User> listUsersByPage(int pageNum, String keyword);

	List<Role> getAllRoles();
	
	User findUserById(Integer id);
}
