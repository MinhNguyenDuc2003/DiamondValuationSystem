package com.diamondvaluation.admin.security.user;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.diamondvaluation.admin.repository.UserRepository;
import com.diamondvaluation.common.User;

@Service
public class CustomUserDetailsService implements UserDetailsService {
	@Autowired
	UserRepository userRepo;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Optional<User> findByUsername = userRepo.findByUsername(username);

		if (findByUsername.isPresent()==false) {
			throw new UsernameNotFoundException("No user found with the given user name");
		}

		return new CustomUserDetails(findByUsername.get());
	}
	
	public UserDetails loadUserById(Integer id) throws UsernameNotFoundException {
		Optional<User> findByUsername = userRepo.findById(id);

		if (!findByUsername.isPresent()) {
			throw new UsernameNotFoundException("No user found with the given Id");
		}

		return new CustomUserDetails(findByUsername.get());
	}
}
