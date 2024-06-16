package com.diamondvaluation.admin;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.thymeleaf.spring6.SpringWebFluxTemplateEngine;
import org.thymeleaf.spring6.templateresolver.SpringResourceTemplateResolver;
import org.thymeleaf.spring6.view.reactive.ThymeleafReactiveViewResolver;

import com.diamondvaluation.admin.response.UserResponse;
import com.diamondvaluation.common.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@SpringBootApplication
@EntityScan({ "com.diamondvaluation.common" })
@EnableJpaAuditing
public class SystemAdminApplication {

	@Bean
	public SpringResourceTemplateResolver thymeleafTemplateResolver() {
		SpringResourceTemplateResolver templateResolver = new SpringResourceTemplateResolver();
		templateResolver.setPrefix("classpath:/templates/");
		templateResolver.setSuffix(".html");
		templateResolver.setTemplateMode("HTML");
		templateResolver.setCacheable(false);
		return templateResolver;
	}
	
	@Bean
    public ThymeleafReactiveViewResolver thymeleafViewResolver() {
        ThymeleafReactiveViewResolver viewResolver = new ThymeleafReactiveViewResolver();
        viewResolver.setTemplateEngine(thymeleafTemplateEngine());
        return viewResolver;
    }

	@Bean
	public SpringWebFluxTemplateEngine thymeleafTemplateEngine() {
		SpringWebFluxTemplateEngine templateEngine = new SpringWebFluxTemplateEngine();
		templateEngine.setTemplateResolver(thymeleafTemplateResolver());
		return templateEngine;
	}

	@Bean
	ModelMapper getModelMapper() {
		ModelMapper mapper = new ModelMapper();

		mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
		configureMappingForUser(mapper);
		configureMappingForAppoinment(mapper);

		return mapper;
	}

	private void configureMappingForUser(ModelMapper mapper) {
		mapper.typeMap(User.class, UserResponse.class).addMapping(src -> src.getPhoto(),
				(dest, value) -> dest.setPhoto(value + " "));

	}

	private void configureMappingForAppoinment(ModelMapper mapper) {
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

	public static void main(String[] args) {
		SpringApplication.run(SystemAdminApplication.class, args);
	}
}
