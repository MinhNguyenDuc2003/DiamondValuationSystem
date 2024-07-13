package com.diamondvaluation.shop.exception;

public class ServiceNotFoundException extends RuntimeException{
	public ServiceNotFoundException(String message) {
		super(message);
	}
}
