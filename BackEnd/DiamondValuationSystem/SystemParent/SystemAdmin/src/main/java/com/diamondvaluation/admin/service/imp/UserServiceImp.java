package com.diamondvaluation.admin.service.imp;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.diamondvaluation.admin.exception.UsernameNotFoundException;
import com.diamondvaluation.admin.repository.UserRepository;
import com.diamondvaluation.admin.service.UserService;
import com.diamondvaluation.common.User;

@Service
public class UserServiceImp implements UserService {
	public static final int USERS_PER_PAGE = 10;
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Autowired
	public UserServiceImp(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public User addNewUser(User user) {
		if(isUsernameExist(user.getEmail())) {
			return null;
		}
		
		boolean isUpdatingUser = (user.getId() != null);

		if (isUpdatingUser) {
			User existingUser = userRepository.findById(user.getId()).get();

			if (user.getPassword().isEmpty()) {
				user.setPassword(existingUser.getPassword());
			} else {
				encodePassword(user);
			}

		} else {
			encodePassword(user);
		}

		return userRepository.save(user);
	}
	
	private boolean isUsernameExist(String email) {
		User userInDb = findByUserName(email);
		return userInDb!=null ? true : false;
	}
	
	private void encodePassword(User user) {
		String encodedPassword = passwordEncoder.encode(user.getPassword());
		user.setPassword(encodedPassword);
	}
	@Override
	public User findByUserName(String email) {
		Optional<User> user = userRepository.findByUsername(email);
		if(!user.isPresent()) {
			return null;
		}
		return user.get();
		
		
	}
	@Override
	public boolean deleteUserById(Integer id) {
		User user = userRepository.findById(id).get();
		if(user==null) {
			throw new UsernameNotFoundException("Can not find any user with Id "+id);
		}
		userRepository.deleteById(id);
		return true;
	}

	@Override
	public User getUserById(Integer id) {
		User user = userRepository.findById(id).get();
		if(user==null) {
			throw new UsernameNotFoundException("Can not find any user with Id "+id);
		}
		return user;
	}
	
	@Override
	public List<User> listUsersByPage(int pageNum, String keyword) {
		Pageable pageable = PageRequest.of(pageNum-1, USERS_PER_PAGE);
		List<User> users = null;
		if(keyword!=null && keyword.trim().length()>0) {
			users = userRepository.findAll(keyword, pageable).get().toList();
			return users;
		}
		users = userRepository.findAll(pageable).get().toList();
		return users;
	}

}
