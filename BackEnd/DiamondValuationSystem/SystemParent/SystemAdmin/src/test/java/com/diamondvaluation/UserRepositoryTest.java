package com.diamondvaluation;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import com.diamondvaluation.admin.SystemAdminApplication;
import com.diamondvaluation.admin.repository.UserRepository;
import com.diamondvaluation.common.User;

@SpringBootTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
@Rollback(false)
@ContextConfiguration(classes = SystemAdminApplication.class)
public class UserRepositoryTest {
    @Autowired
    private UserRepository repository;
    
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Test
    public void testAddSuccess() {
    	
        User user = new User();
        String password = "password123";
        user.setPassword(passwordEncoder.encode(password));
        String username = "example@example.com";
        
        assertThat(user).isNotNull();
    }
}
