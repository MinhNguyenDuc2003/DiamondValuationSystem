package com.diamondvaluation.admin.controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.thymeleaf.context.WebContext;
import org.thymeleaf.spring6.SpringWebFluxTemplateEngine;
import org.thymeleaf.web.servlet.JakartaServletWebApplication;

import com.diamondvaluation.admin.AmazonS3Util;
import com.diamondvaluation.admin.Utility;
import com.diamondvaluation.admin.exception.CertificateIsAlreadyExistException;
import com.diamondvaluation.admin.exception.CertificateNotFoundException;
import com.diamondvaluation.admin.exception.DiamondRequestAlreadyExistCertificateException;
import com.diamondvaluation.admin.request.CertificateRequest;
import com.diamondvaluation.admin.response.CertificateResponse;
import com.diamondvaluation.admin.response.MessageResponse;
import com.diamondvaluation.admin.service.DiamondCertificateService;
import com.diamondvaluation.admin.service.DiamondValuationService;
import com.diamondvaluation.admin.service.UserService;
import com.diamondvaluation.common.DiamondRequest;
import com.diamondvaluation.common.DiamondValuation;
import com.diamondvaluation.common.User;
import com.diamondvaluation.common.diamond.DiamondCertificate;
import com.diamondvaluation.common.diamond.DiamondClarity;
import com.diamondvaluation.common.diamond.DiamondColor;
import com.diamondvaluation.common.diamond.DiamondFluorescence;
import com.diamondvaluation.common.diamond.DiamondMake;
import com.diamondvaluation.common.diamond.DiamondPolish;
import com.diamondvaluation.common.diamond.DiamondSymmetry;
import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.awscore.exception.AwsServiceException;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.services.s3.model.S3Exception;

@RestController
@RequestMapping("/api/certificates/")
@RequiredArgsConstructor
public class DiamondCertificateController {
	private final DiamondCertificateService service;
	private final ModelMapper modelMapper;
	private final SpringWebFluxTemplateEngine templateEngine;
	private final DiamondValuationService valuationService;
	private final UserService userService;

	@PostMapping("certificate/save")
	public ResponseEntity<?> addNewCertificate(@ModelAttribute @Valid CertificateRequest request
			,@RequestParam(name = "photo", required = false) MultipartFile multipartFile) throws S3Exception, AwsServiceException, SdkClientException, IOException {
		try {
			DiamondCertificate certificate = request2Entity(request);
			DiamondCertificate savedCertificate = null;			
			if (multipartFile!=null && !multipartFile.isEmpty()) {
				String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
				certificate.setPhoto(fileName);
				DiamondValuation valuation = valuationService.save(certificate);
				certificate.setValuation(valuation);
				savedCertificate = service.save(certificate);
				
				if (savedCertificate != null) {
					String uploadDir = "certificate-photos/" + savedCertificate.getId();
					AmazonS3Util.removeFolder(uploadDir);
					AmazonS3Util.uploadFile(uploadDir, fileName, multipartFile.getInputStream());
				}
			} else {
				if (certificate.getPhoto()==null || certificate.getPhoto().isEmpty())
					certificate.setPhoto(null);
				DiamondValuation valuation = valuationService.save(certificate);
				certificate.setValuation(valuation);
				savedCertificate = service.save(certificate);
			}
			if (savedCertificate == null) {
				return ResponseEntity.badRequest().build();
			}
			return new ResponseEntity<>(new MessageResponse("Add/Update User successfully!"), HttpStatus.OK);
		} catch (CertificateIsAlreadyExistException e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		} catch (DiamondRequestAlreadyExistCertificateException e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}

	private DiamondCertificate request2Entity(CertificateRequest request) {
		DiamondCertificate certificate = modelMapper.map(request, DiamondCertificate.class);
		DiamondColor color = DiamondColor.valueOf(request.getColor());
		DiamondClarity clarity = DiamondClarity.valueOf(request.getClarity());
		DiamondMake make = DiamondMake.valueOf(request.getMake());
		DiamondPolish polish = DiamondPolish.valueOf(request.getPolish());
		DiamondSymmetry symmetry = DiamondSymmetry.valueOf(request.getSymmetry());
		DiamondFluorescence flourescence = DiamondFluorescence.valueOf(request.getFlourescence());
		certificate.setColor(color);
		certificate.setClarity(clarity);
		certificate.setMake(make);
		certificate.setPolish(polish);
		certificate.setSymmetry(symmetry);
		certificate.setFlourescence(flourescence);
		certificate.setMeasurement(request.getMeasurement());
		DiamondRequest diamondRequest = new DiamondRequest(request.getRequest_id());
		certificate.setRequest(diamondRequest);
		certificate.setCode(request.getCode());
		certificate.setId(request.getId());
		return certificate;
	}

	private CertificateResponse entity2Response(DiamondCertificate certificate) {
		CertificateResponse response = modelMapper.map(certificate, CertificateResponse.class);
		response.setRequestId(certificate.getRequest().getId());
		response.setCreated_date(certificate.getCreatedDate());
		if(certificate.getValuation()!=null) {
			DiamondValuation valuation = valuationService.getById(certificate.getValuation().getId());
			response.setMaxPrice(valuation.getMaxPrice());
			response.setMinPrice(valuation.getMinPrice());
			response.setRealPrice(valuation.getRealPrice());
			response.setRapPercent(valuation.getRapPercent());
			response.setRapPrice(valuation.getRapPrice());
			response.setValuationId(valuation.getId());
			}
		if(certificate.getPhoto()!=null) {
			response.setPhoto(AmazonS3Util.S3_BASE_URI+"/certificate-photos/"+certificate.getId()+"/"+certificate.getPhoto());
		}
		return response;
	}

	@GetMapping("certificate/{id}")
	private ResponseEntity<?> getCertificateById(@PathVariable("id") Integer id) {
		try {
			return ResponseEntity.ok(entity2Response(service.getCertificateById(id)));
		} catch (CertificateNotFoundException e) {
			return ResponseEntity.ok(e.getMessage());
		}
	}

	@DeleteMapping("delete/{id}")
	public ResponseEntity<?> deleteRequestById(@PathVariable("id") Integer id) {
		try {
			boolean isDeleted = service.deleteById(id);
			if (isDeleted == true) {
				String userPhotosDir = "certificate-photos/" + id;
				AmazonS3Util.removeFolder(userPhotosDir);
				return ResponseEntity.ok(new MessageResponse("user id " + id + " is deleted successfully!"));
			}
			return new ResponseEntity<>(new MessageResponse("Delete Certificate successfully with id " + id),
					HttpStatus.OK);
		} catch (CertificateNotFoundException e) {
			return ResponseEntity.status(HttpStatus.OK).body(e.getMessage());
		}
	}

	private List<CertificateResponse> listEntity2Response(List<DiamondCertificate> list) {
		List<CertificateResponse> response = (List<CertificateResponse>) list.stream().map(s -> entity2Response(s))
				.toList();
		return response;
	}

	@GetMapping("all")
	public ResponseEntity<?> getAllCertificate() {
		List<DiamondCertificate> list = service.findAllCertificate();
		return new ResponseEntity(listEntity2Response(list), HttpStatus.OK);
	}

	@GetMapping("/certificate/pdf/{id}")
	public ResponseEntity<?> getPDF(HttpServletRequest req, HttpServletResponse res, @PathVariable("id")  Integer id) throws IOException {
		var application = JakartaServletWebApplication.buildApplication(req.getServletContext());
	    var exchange = application.buildExchange(req, res);
	    WebContext context = new WebContext(exchange);
	    Map<String, Object> model = new HashMap<>();
	    DiamondCertificate cer = service.getCertificateById(id);
	    model.put("reportNumber", cer.getCode());
	    Date date = new Date();
	    model.put("date", date);
	    model.put("cut", cer.getCut());
	    model.put("measurements", cer.getMeasurement());
	    model.put("caratWeight", cer.getCarat());
	    model.put("colorGrade", cer.getColor());
	    model.put("clarityGrade", cer.getClarity());
	    model.put("polish", cer.getPolish());
	    model.put("symmetry", cer.getSymmetry());
	    model.put("fluorescence", cer.getFlourescence());
	    model.put("photo", AmazonS3Util.S3_BASE_URI+"/certificate-photos/"+cer.getId()+"/"+cer.getPhoto());
	    context.setVariables(model);
		String orderHtml = templateEngine.process("DiamondGradingReport", context);
		ByteArrayOutputStream target = new ByteArrayOutputStream();
		ConverterProperties converterProperties = new ConverterProperties();
		converterProperties.setBaseUri("http://localhost:8080");
		HtmlConverter.convertToPdf(orderHtml, target, converterProperties);
		byte[] bytes = target.toByteArray();

		// Send the response as downloadable PDF
		ByteArrayResource resource = new ByteArrayResource(bytes);
		
		return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=order.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(bytes.length)
                .body(resource);

	}
	
	@GetMapping("all/staff-valuation")
	public ResponseEntity<?> getAllCertificateByStaff(HttpServletRequest request) {
		User user = Utility.getIdOfAuthenticatedUser(request, userService);
		List<DiamondCertificate> list = service.findAllCertificateByUser(user);
		return new ResponseEntity(listEntity2Response(list), HttpStatus.OK);
	}
	
	
	@GetMapping("count/year")
    public ResponseEntity<?> countCertificatesByMonthForYear(@RequestParam("year") int year) {
        try {
            List<Object> list = service.countCertificatesByMonthForYear(year);
            return new ResponseEntity<>(list, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
	

}
