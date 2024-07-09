package com.diamondvaluation;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Rule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.diamondvaluation.admin.SystemAdminApplication;
import com.diamondvaluation.admin.controller.rapaport.CaratController;
import com.diamondvaluation.admin.service.rapaport.CaratService;
import com.diamondvaluation.common.diamond_information.Carat;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
@ContextConfiguration(classes = SystemAdminApplication.class)
@ExtendWith({SpringExtension.class, MockitoExtension.class, JiraTestWatcher.class})
public class CaratControllerTest {

    private MockMvc mockMvc;

    @Mock
    private CaratService caratService;

    @InjectMocks
    private CaratController caratController;
    
    @Rule
    public JiraTestWatcher jiraTestWatcher = new JiraTestWatcher();
    
    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(caratController).build();
    }

    @Test
    public void testAddCaratSuccess() throws Exception {
        Carat carat = new Carat();

        doNothing().when(caratService).addCarat(any(Carat.class));

        mockMvc.perform(post("/api/carat/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(carat)))
                .andExpect(status().isOk())
                .andDo(print());

        verify(caratService, times(1)).addCarat(any(Carat.class));
    }

    @Test
    public void testAddCaratFailure() throws Exception {
        Carat carat = new Carat();
        carat.setId(1);
        doThrow(new RuntimeException("Error")).when(caratService).addCarat(any(Carat.class));

        mockMvc.perform(post("/api/carat/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(carat)))
                .andExpect(status().isInternalServerError());

        verify(caratService, times(1)).addCarat(any(Carat.class));
    }

    @Test
    public void testDeleteCaratSuccess() throws Exception {
        int id = 1;
        doNothing().when(caratService).deleteCarat(id);

        mockMvc.perform(delete("/api/carat/delete/{id}", id))
                .andExpect(status().isOk());

        verify(caratService, times(1)).deleteCarat(id);
    }

    @Test
    public void testDeleteCaratFailure() throws Exception {
        int id = 1;
        doThrow(new RuntimeException("Error")).when(caratService).deleteCarat(id);

        mockMvc.perform(delete("/api/carat/delete/{id}", id))
                .andExpect(status().isInternalServerError());

        verify(caratService, times(1)).deleteCarat(id);
    }

    @Test
    public void testUpdateCaratSuccess() throws Exception {
        Carat carat = new Carat();
        carat.setId(1);

        when(caratService.getCaratById(carat.getId())).thenReturn(carat);
        doNothing().when(caratService).updateCarat(any(Carat.class));

        mockMvc.perform(put("/api/carat/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(carat)))
                .andExpect(status().isOk())
                .andDo(print());

        verify(caratService, times(1)).getCaratById(carat.getId());
        verify(caratService, times(1)).updateCarat(any(Carat.class));
    }

    @Test
    public void testUpdateCaratFailure() throws Exception {
        Carat carat = new Carat();
        carat.setId(1);
        when(caratService.getCaratById(carat.getId())).thenReturn(null);

        mockMvc.perform(put("/api/carat/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(carat)))
                .andExpect(status().isNotFound());

        verify(caratService, times(1)).getCaratById(carat.getId());
    }

    @Test
    public void testUpdateCaratException() throws Exception {
        Carat carat = new Carat();
        carat.setId(1);
        when(caratService.getCaratById(carat.getId())).thenReturn(carat);
        doThrow(new RuntimeException("Error")).when(caratService).updateCarat(any(Carat.class));

        mockMvc.perform(put("/api/carat/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(carat)))
                .andExpect(status().isInternalServerError());

        verify(caratService, times(1)).updateCarat(any(Carat.class));
    }

    private static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
