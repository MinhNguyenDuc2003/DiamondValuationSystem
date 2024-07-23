package com.diamondvaluation.shop.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.diamondvaluation.shop.PayPalConfig;
import com.diamondvaluation.shop.PaymentSettingBag;
import com.diamondvaluation.shop.PaypalPaymentIntent;
import com.diamondvaluation.shop.PaypalPaymentMethod;
import com.diamondvaluation.shop.exception.PayPalApiException;
import com.diamondvaluation.shop.response.PayPalOrderResponse;
import com.paypal.api.payments.Amount;
import com.paypal.api.payments.Payer;
import com.paypal.api.payments.Payment;
import com.paypal.api.payments.PaymentExecution;
import com.paypal.api.payments.RedirectUrls;
import com.paypal.api.payments.Transaction;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;

@Component
public class PayPalService {
	private static final String GET_ORDER_API = "/v2/checkout/orders/";
	@Autowired
	private APIContext apiContext;
	@Autowired
	private SettingService settingService;
	@Autowired
    private PayPalConfig payPalConfig;
	
	private static final AtomicLong counter = new AtomicLong();

	public boolean validateOrder(String orderId) throws PayPalApiException {
		PayPalOrderResponse orderResponse = getOrderDetails(orderId);

		return orderResponse.validate(orderId);
	}

	private PayPalOrderResponse getOrderDetails(String orderId) throws PayPalApiException {
		ResponseEntity<PayPalOrderResponse> response = makeRequest(orderId);

		HttpStatus statusCode = (HttpStatus) response.getStatusCode();

		if (!statusCode.equals(HttpStatus.OK)) {
			throwExceptionForNonOKResponse(statusCode);
		}

		return response.getBody();
	}

	private ResponseEntity<PayPalOrderResponse> makeRequest(String orderId) {
		PaymentSettingBag paymentSettings = settingService.getPaymentSettings();
		String baseURL = paymentSettings.getPayPalUrl();
		String requestURL = baseURL + GET_ORDER_API + orderId;
		String clientId = paymentSettings.getClientId();
		String clientSecret = paymentSettings.getClientSecret();

		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
		headers.add("Accept-Language", "en_US");
		headers.setBasicAuth(clientId, clientSecret);

		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(headers);
		RestTemplate restTemplate = new RestTemplate();

		return restTemplate.exchange(requestURL, HttpMethod.GET, request, PayPalOrderResponse.class);
	}

	private void throwExceptionForNonOKResponse(HttpStatus statusCode) throws PayPalApiException {
		String message = null;

		switch (statusCode) {
		case NOT_FOUND:
			message = "Order ID not found";

		case BAD_REQUEST:
			message = "Bad Request to PayPal Checkout API";

		case INTERNAL_SERVER_ERROR:
			message = "PayPal server error";

		default:
			message = "PayPal returned non-OK status code";
		}

		throw new PayPalApiException(message);
	}
	
	public Payment createPayment(
			Double total, 
			String currency, 
			PaypalPaymentMethod method, 
			PaypalPaymentIntent intent, 
			String description, 
			String cancelUrl, 
			String successUrl) throws PayPalRESTException{
		Amount amount = new Amount();
		amount.setCurrency(currency);
		System.out.println(String.format("%.2f", total));
		amount.setTotal(String.format("%.2f", total).replace(",", "."));

		Transaction transaction = new Transaction();
		transaction.setDescription(description);
		transaction.setAmount(amount);

		List<Transaction> transactions = new ArrayList<>();
		transactions.add(transaction);

		Payer payer = new Payer();
		payer.setPaymentMethod(method.toString());

		Payment payment = new Payment();
		payment.setIntent(intent.toString());
		payment.setPayer(payer);
		payment.setTransactions(transactions);
		RedirectUrls redirectUrls = new RedirectUrls();
		redirectUrls.setCancelUrl(cancelUrl);
		redirectUrls.setReturnUrl(successUrl);
		payment.setRedirectUrls(redirectUrls);
		 APIContext apiContext = new APIContext(payPalConfig.getClientId(), payPalConfig.getClientSecret(), payPalConfig.getMode());
		return payment.create(apiContext);
	}
	

	public Payment executePayment(String paymentId, String payerId, HttpHeaders headers) throws PayPalRESTException {
		 // Generate a new unique request ID for each transaction
        String requestId = UUID.randomUUID().toString();
        System.out.println("Generated PayPal-Request-Id: " + requestId);

        // Create a temporary API context with the unique request ID
        APIContext tempApiContext = new APIContext(apiContext.getClientID(), apiContext.getClientSecret(), payPalConfig.getMode());
        tempApiContext.addHTTPHeader("PayPal-Request-Id", requestId);

        // Additional logging for debugging
        System.out.println("Payment ID: " + paymentId);
        System.out.println("Payer ID: " + payerId);

        // Set up the payment and payment execution
        Payment payment = new Payment();
        payment.setId(paymentId);
        PaymentExecution paymentExecute = new PaymentExecution();
        paymentExecute.setPayerId(payerId);

        try {
            // Execute the payment
            Payment executedPayment = payment.execute(tempApiContext, paymentExecute);
            System.out.println("Payment executed successfully: " + executedPayment.getId());
            return executedPayment;
        } catch (PayPalRESTException e) {
            // Log error details for debugging
            System.err.println("Error executing PayPal payment: " + e.getMessage());
            System.err.println("Response code: " + e.getResponsecode());
            System.err.println("Error response: " + e.getDetails());
            throw e;
        }
	}

}
