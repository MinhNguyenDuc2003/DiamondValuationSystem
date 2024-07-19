package com.diamondvaluation.attributetest;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.diamondvaluation.admin.controller.rapaport.CaratController;
import com.diamondvaluation.admin.service.rapaport.CaratService;
import com.diamondvaluation.common.diamond_information.Carat;
import com.fasterxml.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
@WebMvcTest(CaratController.class)
public class CaratControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private CaratService caratService;

	@Autowired
	private ObjectMapper objectMapper;

	private Carat carat;

	@BeforeEach
	void setUp() {
		carat = new Carat();
		carat.setBeginCarat(0.5f);
		carat.setEndCarat(1.0f);
	}

	@Test
	public void addCarat_success() throws Exception {
		doNothing().when(caratService).addCarat(any(Carat.class));

		mockMvc.perform(post("/api/carat/add").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(carat))).andExpect(status().isOk())
				.andExpect(content().string("Carat added successfully"));

		verify(caratService).addCarat(any(Carat.class));
	}

	@Test
	public void addCarat_failure() throws Exception {
		doThrow(new RuntimeException("Error adding carat")).when(caratService).addCarat(any(Carat.class));

		mockMvc.perform(post("/api/carat/add").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(carat))).andExpect(status().isInternalServerError())
				.andExpect(content().string("Error adding carat: Error adding carat"));

	}
}
