package com.diamondvaluation.attributetest;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup;

import java.io.FileWriter;
import java.io.IOException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import java.util.Optional;

import com.diamondvaluation.admin.controller.rapaport.AttributeController;
import com.diamondvaluation.admin.repository.rapaport.CaratRepository;
import com.diamondvaluation.admin.repository.rapaport.DiamondAttributeRepository;
import com.diamondvaluation.admin.service.rapaport.AttributeService;
import com.diamondvaluation.common.diamond.DiamondClarity;
import com.diamondvaluation.common.diamond.DiamondColor;
import com.diamondvaluation.common.diamond_information.Carat;
import com.diamondvaluation.common.diamond_information.DiamondAttribute;
import com.fasterxml.jackson.databind.ObjectMapper;

public class AttributeControllerTest {

	private static final String TEST_RESULTS_FILE_PATH = "D:/DiamondValuation/BackEnd/DiamondValuationSystem/SystemParent/SystemAdmin/src/test/java/test-results.txt";

	private MockMvc mockMvc;

	@Mock
	private AttributeService attributeService;

	@Mock
	private DiamondAttributeRepository attributeRepo;

	@Mock
	private CaratRepository caratRepository;

	@Mock
	private ModelMapper modelMapper;

	@InjectMocks
	private AttributeController attributeController;

	@BeforeEach
	public void setUp() {
		MockitoAnnotations.openMocks(this);
		this.mockMvc = standaloneSetup(attributeController).build();
	}

	public static void writeResultToFile(String fileName, String result) {
		try (FileWriter fileWriter = new FileWriter(fileName, true)) {
			fileWriter.write(result + System.lineSeparator());
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@Test
	public void a () {
	   
	    DiamondAttribute diamondAttribute = new DiamondAttribute();
	    diamondAttribute.setClarity(DiamondClarity.VS1);
	    diamondAttribute.setColor(DiamondColor.D);
	    diamondAttribute.setNumber(1.0f);

	    Carat carat = new Carat();
	    carat.setId(1);

	    when(caratRepository.findById(1)).thenReturn(Optional.of(carat));
	    
	    ResponseEntity<String> response = attributeController.addDiamondAttribute(diamondAttribute, 1);
	    assertEquals(HttpStatus.OK, response.getStatusCode());
	    assertEquals("Added successfully", response.getBody());
	    verify(attributeService).addDiamondAttribute(any(DiamondAttribute.class), eq(1));

	    writeResultToFile(TEST_RESULTS_FILE_PATH,
	            "testAddDiamondAttributeSuccess: " + response.getStatusCode() + " - " + response.getBody());
	}

	@Test
	public void testAddDiamondAttribute_DuplicateId() {
		DiamondAttribute diamondAttribute = new DiamondAttribute();
		diamondAttribute.setClarity(DiamondClarity.VVS1);
		diamondAttribute.setColor(DiamondColor.D);
		diamondAttribute.setNumber(1.0f);

		doThrow(new RuntimeException("Duplicate ID")).when(attributeService)
				.addDiamondAttribute(any(DiamondAttribute.class), eq(15));

		ResponseEntity<String> response = attributeController.addDiamondAttribute(diamondAttribute, 15);

		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
		assertEquals("Error adding diamond attribute: Duplicate ID", response.getBody());
		verify(attributeService).addDiamondAttribute(any(DiamondAttribute.class), eq(15));

		writeResultToFile(TEST_RESULTS_FILE_PATH,
				"testAddDiamondAttribute_DuplicateId: " + response.getStatusCode() + " - " + response.getBody());
	}

	@Test
	public void testUpdateDiamondAttribute_Success() {
		DiamondAttribute diamondAttribute = new DiamondAttribute();
		diamondAttribute.setClarity(DiamondClarity.VVS1);
		diamondAttribute.setColor(DiamondColor.D);
		diamondAttribute.setNumber(1.0f);

		ResponseEntity<String> response = attributeController.updateDiamondAttribute(1, diamondAttribute);

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals("Updated successfully", response.getBody());
		verify(attributeService).updateDiamondAttribute(eq(1), any(DiamondAttribute.class));

		writeResultToFile(TEST_RESULTS_FILE_PATH,
				"testUpdateDiamondAttribute_Success: " + response.getStatusCode() + " - " + response.getBody());
	}

	@Test
	public void testUpdateDiamondAttribute_Failure() {
		DiamondAttribute diamondAttribute = new DiamondAttribute();
		diamondAttribute.setClarity(DiamondClarity.VVS1);
		diamondAttribute.setColor(DiamondColor.D);
		diamondAttribute.setNumber(1.0f);

		doThrow(new RuntimeException("Update failed")).when(attributeService).updateDiamondAttribute(eq(1),
				any(DiamondAttribute.class));

		ResponseEntity<String> response = attributeController.updateDiamondAttribute(1, diamondAttribute);

		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
		assertEquals("Error updating diamond attribute: Update failed", response.getBody());
		verify(attributeService).updateDiamondAttribute(eq(1), any(DiamondAttribute.class));

		writeResultToFile(TEST_RESULTS_FILE_PATH,
				"testUpdateDiamondAttribute_Failure: " + response.getStatusCode() + " - " + response.getBody());
	}

	@Test
	public void testDeleteDiamondAttribute_Success() {
		ResponseEntity<String> response = attributeController.deleteDiamondAttribute(1);

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals("Deleted successfully", response.getBody());
		verify(attributeService).deleteDiamondAttribute(eq(1));

		writeResultToFile(TEST_RESULTS_FILE_PATH,
				"testDeleteDiamondAttribute_Success: " + response.getStatusCode() + " - " + response.getBody());
	}

	@Test
	public void testDeleteDiamondAttribute_Failure() {
		doThrow(new RuntimeException("Delete failed")).when(attributeService).deleteDiamondAttribute(eq(1));

		ResponseEntity<String> response = attributeController.deleteDiamondAttribute(1);

		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
		assertEquals("Error deleting diamond attribute: Delete failed", response.getBody());
		verify(attributeService).deleteDiamondAttribute(eq(1));

		writeResultToFile(TEST_RESULTS_FILE_PATH,
				"testDeleteDiamondAttribute_Failure: " + response.getStatusCode() + " - " + response.getBody());
	}
}