package com.diamondvaluation.admin.controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
import com.diamondvaluation.admin.exception.CertificateNotFoundException;
import com.diamondvaluation.admin.exception.RequestNotFoundException;
import com.diamondvaluation.admin.request.CertificateRequest;
import com.diamondvaluation.admin.response.CertificateResponse;
import com.diamondvaluation.admin.response.MessageResponse;
import com.diamondvaluation.admin.service.DiamondCertificateService;
import com.diamondvaluation.common.DiamondRequest;
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

@RestController
@RequestMapping("/api/certificates/")
public class DiamondCertificateController {
	private final DiamondCertificateService service;
	private final ModelMapper modelMapper;
	private final SpringWebFluxTemplateEngine templateEngine;

	@Autowired
	public DiamondCertificateController(DiamondCertificateService service, ModelMapper modelMapper,
			SpringWebFluxTemplateEngine templateEngine) {
		this.service = service;
		this.modelMapper = modelMapper;
		this.templateEngine = templateEngine;
	}

	@PostMapping("certificate/save")
	public ResponseEntity<?> addNewCertificate(@ModelAttribute @Valid CertificateRequest request
			,@RequestParam(name = "photo", required = false) MultipartFile multipartFile) {
		try {
			DiamondCertificate certificate = request2Entity(request);
			DiamondCertificate savedCertificate = null;			
			if (multipartFile!=null && !multipartFile.isEmpty()) {
				String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
				certificate.setPhoto(fileName);
				savedCertificate = service.save(certificate);
				if (savedCertificate != null) {
					String uploadDir = "certificate-photos/" + savedCertificate.getId();
					AmazonS3Util.removeFolder(uploadDir);
					AmazonS3Util.uploadFile(uploadDir, fileName, multipartFile.getInputStream());
				}
			} else {
				if (certificate.getPhoto()==null || certificate.getPhoto().isEmpty())
					certificate.setPhoto(null);
				savedCertificate = service.save(certificate);
			}
			if (savedCertificate == null) {
				return ResponseEntity.badRequest().build();
			}
			return new ResponseEntity<>(new MessageResponse("Add/Update User successfully!"), HttpStatus.OK);
		} catch (Exception e) {
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
		DiamondRequest diamondRequest = new DiamondRequest(request.getRequest_id());
		certificate.setRequest(diamondRequest);
		return certificate;
	}

	private CertificateResponse entity2Response(DiamondCertificate certificate) {
		CertificateResponse response = modelMapper.map(certificate, CertificateResponse.class);

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

	@GetMapping("/certificate/pdf")
	public ResponseEntity<?> getPDF(HttpServletRequest req, HttpServletResponse res) throws IOException {
		var application = JakartaServletWebApplication.buildApplication(req.getServletContext());
	    var exchange = application.buildExchange(req, res);
	    WebContext context = new WebContext(exchange);
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

}
