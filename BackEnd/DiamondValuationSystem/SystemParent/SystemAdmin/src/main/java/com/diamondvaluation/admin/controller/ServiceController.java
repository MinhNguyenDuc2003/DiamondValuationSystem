package com.diamondvaluation.admin.controller;

import java.io.IOException;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.diamondvaluation.admin.AmazonS3Util;
import com.diamondvaluation.admin.exception.ServiceNameIsAlreadyExistException;
import com.diamondvaluation.admin.exception.ServiceNotFoundException;
import com.diamondvaluation.admin.request.ServiceRequest;
import com.diamondvaluation.admin.response.MessageResponse;
import com.diamondvaluation.admin.response.ServiceResponse;
import com.diamondvaluation.admin.service.ServiceService;
import com.diamondvaluation.common.DiamondService;

import jakarta.validation.Valid;
import software.amazon.awssdk.awscore.exception.AwsServiceException;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.services.s3.model.S3Exception;

@RestController
@RequestMapping("/api/services/")
public class ServiceController {
	private final ServiceService sService;
	private final ModelMapper modelMapper;
	
	public ServiceController(ServiceService service, ModelMapper modelMapper) {
		this.sService = service;
		this.modelMapper = modelMapper;
	}
	
	@PostMapping("service/save")
	public ResponseEntity<?> addNewService(@ModelAttribute @Valid ServiceRequest serviceRequest,
			@RequestParam(name = "photo", required = false) MultipartFile multipartFile
			)throws S3Exception, AwsServiceException, SdkClientException, IOException  {
		try {
			DiamondService service = request2Entity(serviceRequest);
			DiamondService savedService = null;
			if (multipartFile!=null && !multipartFile.isEmpty()) {
				String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
				service.setPhoto(fileName);
				savedService = sService.save(service);
				if (savedService != null) {
					String uploadDir = "service-photos/" + savedService.getId();
					AmazonS3Util.removeFolder(uploadDir);
					AmazonS3Util.uploadFile(uploadDir, fileName, multipartFile.getInputStream());
				}
			} else {
				if (service.getPhoto()==null || service.getPhoto().isEmpty())
					service.setPhoto(null);
				savedService = sService.save(service);
			}

			if (savedService == null) {
				return ResponseEntity.badRequest().build();
			}
			return new ResponseEntity<>(new MessageResponse("Add/Update Service successfully!"), HttpStatus.OK);
		} catch (ServiceNameIsAlreadyExistException e) {
			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(e.getMessage());
		}
	}
	
	private DiamondService request2Entity(ServiceRequest request) {
		DiamondService service = modelMapper.map(request, DiamondService.class);
		return service;
	}
	
	private ServiceResponse entity2Response(DiamondService service) {
		ServiceResponse response = modelMapper.map(service, ServiceResponse.class);
		String photoName =  service.getPhoto();
		response.setPhoto(AmazonS3Util.S3_BASE_URI+"/service-photos/"+service.getId()+"/"+photoName);
		return response;
	}
	
	private List<ServiceResponse> listEntity2Response(List<DiamondService> list) {
		List<ServiceResponse> response =(List<ServiceResponse>) list.stream().map(s -> entity2Response(s)).toList();
		return response;
	}
	
	@GetMapping("service/{id}")
	public ResponseEntity<?> getServiceById(@PathVariable("id") Integer id) {
		try {
			return new ResponseEntity<ServiceResponse>(entity2Response(sService.getServiceById(id)), HttpStatus.OK);
		} catch (ServiceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(e.getMessage());
		}
	}
	
	@DeleteMapping("delete/{id}")
	public ResponseEntity<?> delete(@PathVariable("id") Integer id) {
		try {
			boolean isDeleted = sService.deleteServiceById(id);
			if (isDeleted == true) {
				String userPhotosDir = "service-photos/" + id;
				AmazonS3Util.removeFolder(userPhotosDir);
				return ResponseEntity.ok(new MessageResponse("service id: " + id + " is deleted successfully!"));
			}
		} catch (ServiceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.OK).body(e.getMessage());
		}
		return ResponseEntity.badRequest().build();
	}
	
	@GetMapping("all-services")
	public ResponseEntity<List<DiamondService>> getAllServices(){
		List<DiamondService> list= sService.findAllService();
		return new ResponseEntity(listEntity2Response(list), HttpStatus.OK);
	}
}
