package com.diamondvaluation.admin.controller.rapaport;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.admin.service.rapaport.CaratService;
import com.diamondvaluation.common.diamond_information.Carat;

@RestController
@RequestMapping("/api/carat")
public class CaratController {

	@Autowired
	private CaratService caratService; 

	@PostMapping("/add")
    public ResponseEntity<String> addCarat(@RequestBody Carat carat) {
        try {
            caratService.addCarat(carat);
            return ResponseEntity.ok("Carat added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding carat: " + e.getMessage());
        }
    }

	@GetMapping("/{caratId}")
	public ResponseEntity<?> getCaratById(@PathVariable("caratId") Integer id) {
	    try {
	        Carat carat = caratService.getCaratById(id);
	        if (carat == null) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Carat not found");
	        }
	        return ResponseEntity.ok(carat);
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving carat: " + e.getMessage());
	    }
	}

	@PutMapping("/update")
	public ResponseEntity<String> updateCarat(@RequestBody Carat carat) {
	    try {
	        Carat existingCarat = caratService.getCaratById(carat.getId());
	        if (existingCarat == null) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Carat not found");
	        }
	        caratService.updateCarat(carat);
	        return ResponseEntity.ok("Carat updated successfully");
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating carat: " + e.getMessage());
	    }
	}
	
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCarat(@PathVariable("id") Integer id) {
        try {
            caratService.deleteCarat(id);
            return ResponseEntity.ok("Carat deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting carat: " + e.getMessage());
        }
    }
	
}

