package com.diamondvaluation.admin.controller.rapaport;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.admin.response.AttributeResponse;
import com.diamondvaluation.admin.response.RapaportResponse;
import com.diamondvaluation.admin.service.rapaport.AttributeService;
import com.diamondvaluation.common.Customer;
import com.diamondvaluation.common.diamond_information.DiamondAttribute;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/attribute")
public class AttributeController {

	@Autowired
	private AttributeService attributeService;
	@Autowired
	private ModelMapper modelMapper;
	
	private AttributeResponse entity2Response(DiamondAttribute attribute) {
		AttributeResponse response = modelMapper.map(attribute, AttributeResponse.class);
		return response;
	}
	
	private List<AttributeResponse> listEntity2ListResponse(List<DiamondAttribute> attributes) {
		List<AttributeResponse> response = new ArrayList<>();
		for(DiamondAttribute attribute : attributes) {
			response.add(entity2Response(attribute));
		}
		return response;
	}
	

    @PostMapping("/add/{caratId}")
    public ResponseEntity<String> addDiamondAttribute(@RequestBody @Valid DiamondAttribute diamondAttribute,@PathVariable("caratId")Integer caratId) {
        try {
            attributeService.addDiamondAttribute(diamondAttribute, caratId);
            return ResponseEntity.ok("Added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding diamond attribute: " + e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateDiamondAttribute(@PathVariable Integer id, @RequestBody DiamondAttribute diamondAttribute) {
        try {
            attributeService.updateDiamondAttribute(id, diamondAttribute);
            return ResponseEntity.ok("Updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating diamond attribute: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteDiamondAttribute(@PathVariable Integer id) {
        try {
            attributeService.deleteDiamondAttribute(id);
            return ResponseEntity.ok("Deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting diamond attribute: " + e.getMessage());
        }
    }

    @GetMapping("/carat/{caratId}")
    public ResponseEntity<List<AttributeResponse>> findAttributesByCaratId(@PathVariable("caratId") Integer caratId ) {
        try {
            List<DiamondAttribute> attributes = attributeService.findAttributesByCaratId(caratId);
            
            return ResponseEntity.ok().body(listEntity2ListResponse(attributes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<RapaportResponse>> getAllRapaport(){
    	return ResponseEntity.ok().body(attributeService.getAll());
    }
	
}

