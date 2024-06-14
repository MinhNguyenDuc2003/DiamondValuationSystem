package com.diamondvaluation.shop;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@SpringBootApplication
@EntityScan({"com.diamondvaluation.common"})
@EnableJpaAuditing
public class DiamondValuationShopApplication {

	public static void main(String[] args) {
		SpringApplication.run(DiamondValuationShopApplication.class, args);
	}
	
    @Bean
    ModelMapper getModelMapper() {
		ModelMapper mapper = new ModelMapper();	
		mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);	
		return mapper;
	}
    
   


	@Bean
	public ObjectMapper objectMapper() {
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.registerModule(new JavaTimeModule());
        objectMapper.findAndRegisterModules(); // This line automatically registers all modules found in the classpath.
		objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
		objectMapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
		
		return objectMapper;
	}
	

}
