package com.diamondvaluation.shop.controller;

import java.io.UnsupportedEncodingException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
import com.diamondvaluation.shop.exception.PayPalApiException;
import com.diamondvaluation.shop.request.CheckOutRequest;
import com.diamondvaluation.shop.service.DiamondRequestService;
import com.diamondvaluation.shop.service.PayPalService;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class CheckoutController {
	private final ControllerHelper controllerHelper;
	private final DiamondRequestService requestService;
	private final PayPalService paypalService;
	
	private Logger log = LoggerFactory.getLogger(getClass());
	
	public static final String PAYPAL_SUCCESS_URL = "api/pay/success";
	public static final String PAYPAL_CANCEL_URL = "api/pay/cancel";
	
	@Autowired
	public CheckoutController(ControllerHelper controllerHelper, DiamondRequestService requestService,
			PayPalService paypalService) {
		this.controllerHelper = controllerHelper;
		this.requestService = requestService;
		this.paypalService = paypalService;
	}

	@GetMapping("/checkout")
	public ResponseEntity<?> placeOrder(@RequestBody @Valid CheckOutRequest checkOutRequest,
			HttpServletRequest request) {
		try {
			Customer customer = controllerHelper.getAuthenticatedCustomer(request);
			boolean isPaid = false;
			if (checkOutRequest.getPayment_method().equals("CK")) {
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
	public ResponseEntity<?> pay(HttpServletRequest request){
		String cancelUrl = "http://localhost:3000/";
		String successUrl = "http://localhost:3000/";
		try {
			Payment payment = paypalService.createPayment(
					4.0, 
					"USD", 
					PaypalPaymentMethod.paypal, 
					PaypalPaymentIntent.sale,
					"payment description", 
					cancelUrl, 
					successUrl);
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
	
	@GetMapping("pay/validate")
	@Transactional
	public ResponseEntity<?> successPay(@RequestParam("paymentId") String paymentId,@RequestParam("PayerID") String payerId,
			@RequestBody @Valid CheckOutRequest checkOutRequest,
			HttpServletRequest request) throws UnsupportedEncodingException, MessagingException {
	    try {
	        Payment payment = paypalService.executePayment(paymentId, payerId);
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
