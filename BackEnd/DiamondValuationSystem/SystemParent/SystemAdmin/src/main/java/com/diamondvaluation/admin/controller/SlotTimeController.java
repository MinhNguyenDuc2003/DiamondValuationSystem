package com.diamondvaluation.admin.controller;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.admin.exception.SlotTimeAlredyExistException;
import com.diamondvaluation.admin.service.SlotTimeService;
import com.diamondvaluation.common.SlotTime;

@RestController
@RequestMapping("/slot-times")
public class SlotTimeController {
	private final SlotTimeService service;
	private final ModelMapper modelMapper;

	
	public SlotTimeController(SlotTimeService service, ModelMapper modelMapper) {
		this.service = service;
		this.modelMapper = modelMapper;
	}


	@PostMapping("/save")
	public ResponseEntity<?> saveSlotTime(@RequestBody SlotTime slotTime){
		try {
			service.save(slotTime);
			return ResponseEntity.ok().build();
		} catch (SlotTimeAlredyExistException e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<?> deleteSlotTime(@PathVariable("id") String id){
		try {
			service.deleteById(Integer.parseInt(id));
			return ResponseEntity.ok().build();
		} catch (SlotTimeAlredyExistException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
			
		}
	
	@GetMapping("/all")
	public ResponseEntity<?> getAllSlotTime(){
		try {
			List<SlotTime> list = service.getAllSlot();
			return ResponseEntity.ok(list);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}
	
}
