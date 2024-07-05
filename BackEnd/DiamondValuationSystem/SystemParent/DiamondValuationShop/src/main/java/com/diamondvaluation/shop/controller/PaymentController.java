package com.diamondvaluation.shop.controller;

import java.io.UnsupportedEncodingException;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.diamondvaluation.common.Customer;
import com.diamondvaluation.shop.ControllerHelper;
import com.diamondvaluation.shop.PaypalPaymentIntent;
import com.diamondvaluation.shop.PaypalPaymentMethod;
import com.diamondvaluation.shop.exception.CustomerNotFoundException;
import com.diamondvaluation.shop.request.CheckOutRequest;
import com.diamondvaluation.shop.service.DiamondRequestService;
import com.diamondvaluation.shop.service.PayPalService;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class PaymentController {
	private final ControllerHelper controllerHelper;
	private final DiamondRequestService requestService;
	private final PayPalService paypalService;
	
	private Logger log = LoggerFactory.getLogger(getClass());
	
	public static final String PAYPAL_SUCCESS_URL = "api/pay/success";
	public static final String PAYPAL_CANCEL_URL = "api/pay/cancel";
	
	@Value("${baseUrl}")
	private String BASEURL;
	
	@Autowired
	public PaymentController(ControllerHelper controllerHelper, DiamondRequestService requestService,
			PayPalService paypalService) {
		this.controllerHelper = controllerHelper;
		this.requestService = requestService;
		this.paypalService = paypalService;
	}

	@PostMapping("/check-out")
	public ResponseEntity<?> placeOrder(@RequestBody @Valid CheckOutRequest checkOutRequest,
			HttpServletRequest request) {
		try {
			Customer customer = controllerHelper.getAuthenticatedCustomer(request);
			boolean isPaid = false;
			if (checkOutRequest.getPaymentMethod().equals("PAYPAL")) {
				isPaid = true;
			}
			requestService.createDiamondRequest(checkOutRequest, customer, isPaid);
			return ResponseEntity.ok().build();
		} catch (CustomerNotFoundException e) {
			return ResponseEntity.badRequest().build();
		}
	}
	
//	public ResponseEntity<?> processPayPalOrder(HttpServletRequest request,String orderId,
//			@RequestBody @Valid CheckOutRequest checkOutRequest)throws UnsupportedEncodingException, MessagingException {
//		String message = null;
//		
//		try {
//			if (paypalService.validateOrder(orderId)) {
//				return placeOrder(checkOutRequest, request);
//			} else {
//				message = "ERROR: Transaction could not be completed because order information is invalid";
//				return ResponseEntity.badRequest().body(message);
//			}
//		} catch (PayPalApiException e) {
//			message = "ERROR: Transaction failed due to error: " + e.getMessage();
//			return ResponseEntity.badRequest().body(message);
//		}
//	}
	
	@PostMapping("/pay")
	public ResponseEntity<?> pay(HttpServletRequest request, @RequestParam("total") double total){
		try {
			Payment payment = paypalService.createPayment(
					total, 
					"USD", 
					PaypalPaymentMethod.paypal, 
					PaypalPaymentIntent.sale,
					"payment description", 
					BASEURL+"pay/cancel", 
					BASEURL+"pay/success");
			for(Links links : payment.getLinks()){
				if(links.getRel().equals("approval_url")){
					return ResponseEntity.ok(links.getHref());
				}
			}
		} catch (PayPalRESTException e) {
			log.error(e.getMessage());
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment not approved");
	}
	
	@PostMapping("pay/validate")
	@Transactional
	public ResponseEntity<?> successPay(@RequestParam("paymentId") String paymentId,@RequestParam("PayerID") String payerId,
			@RequestBody @Valid CheckOutRequest checkOutRequest,
			HttpServletRequest request) throws UnsupportedEncodingException, MessagingException {
	    try {
	    	String requestId = UUID.randomUUID().toString();
	    	HttpHeaders headers = new HttpHeaders();
	        headers.add("PayPal-Request-Id", requestId);
	        Payment payment = paypalService.executePayment(paymentId, payerId, headers);
	        if (payment.getState().equals("approved")) {
	            return placeOrder(checkOutRequest,
	        			request);
	        }
	    } catch (PayPalRESTException e) {
	        log.error(e.getMessage());
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Payment failed: " + e.getMessage());
	    }
	    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment not approved");
	}
}
