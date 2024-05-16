package com.diamondvaluation.admin;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;

import com.diamondvaluation.admin.response.UserResponse;
import com.diamondvaluation.common.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.SerializationFeature;

@SpringBootApplication
@EntityScan({"com.diamondvaluation.common"})
public class SystemAdminApplication {


    @Bean
    ModelMapper getModelMapper() {
		ModelMapper mapper = new ModelMapper();
		mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
		configureMappingForUser(mapper);
		
		
		return mapper;
	}


	
	private void configureMappingForUser(ModelMapper mapper) {
		mapper.typeMap(User.class, UserResponse.class)
				.addMapping(src -> src.getPhoto(), 
				(dest, value) -> dest.setImagePath(value+""));
	}



	@Bean
	public ObjectMapper objectMapper() {
		ObjectMapper objectMapper = new ObjectMapper();
		
		objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
		objectMapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
		
		return objectMapper;
	}
	

	public static void main(String[] args) {
		SpringApplication.run(SystemAdminApplication.class, args);
	}
}
