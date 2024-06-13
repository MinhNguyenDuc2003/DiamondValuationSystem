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

import com.diamondvaluation.admin.repository.UserRepository;
import com.diamondvaluation.common.User;

@SpringBootTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
@Rollback(false)
public class UserRepositoryTest {
    @Autowired
    private UserRepository repository;
    
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Test
    public void testAddSuccess() {
    	
        User user = new User();
        String password = "123456";
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail("minh123");
        user.setEnabled(true);
        user.setFirstName("minh");
        user.setLastName("nguyen");
        user.setPhoneNumber("123456789");
        user.setPhoto("123564465");
        User userSaved = repository.save(user);
        
        assertThat(userSaved).isNotNull();
    }
}
