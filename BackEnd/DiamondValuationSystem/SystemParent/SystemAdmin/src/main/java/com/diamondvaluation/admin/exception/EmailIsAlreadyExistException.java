package com.diamondvaluation.admin.exception;

public class EmailIsAlreadyExistException extends RuntimeException{
	public EmailIsAlreadyExistException(String message) {
		super(message);
	}
}
