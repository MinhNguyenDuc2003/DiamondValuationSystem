package com.diamondvaluation.shop.exception;

public class CustomerIsAlreadyExistException extends RuntimeException{
	public CustomerIsAlreadyExistException(String message) {
		super(message);
	}
}
